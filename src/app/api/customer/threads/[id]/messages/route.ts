import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { ConversationThread, Message, Customer } from "@/lib/models-customer";
import mongoose from "mongoose";
import { sendNewMessageEmail } from "@/lib/email/messaging";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/customer/threads/[id]/messages - Get messages for a thread
export async function GET(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session || session.user.principalType !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
  }

  await connectDB();

  try {
    // Verify thread belongs to customer
    const thread = await ConversationThread.findOne({
      _id: new mongoose.Types.ObjectId(id),
      customerId: new mongoose.Types.ObjectId(session.user.id),
    }).lean();

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Get messages
    const messages = await Message.find({
      threadId: new mongoose.Types.ObjectId(id),
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read by customer
    await Message.updateMany(
      {
        threadId: new mongoose.Types.ObjectId(id),
        senderType: "admin",
        readAt: null,
      },
      {
        $set: { readAt: new Date() },
      },
    );

    // Update unread count for customer
    await ConversationThread.findByIdAndUpdate(id, {
      $set: { unreadByCustomer: 0 },
    });

    return NextResponse.json({ thread, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

// POST /api/customer/threads/[id]/messages - Send a message in a thread
export async function POST(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session || session.user.principalType !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const { message, attachments = [] } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long (max 5000 characters)" },
        { status: 400 },
      );
    }

    // Verify thread belongs to customer
    const thread = await ConversationThread.findOne({
      _id: new mongoose.Types.ObjectId(id),
      customerId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Validate attachments
    if (attachments.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 attachments allowed" },
        { status: 400 },
      );
    }

    // Create message
    const newMessage = await Message.create({
      threadId: new mongoose.Types.ObjectId(id),
      senderType: "customer",
      senderId: new mongoose.Types.ObjectId(session.user.id),
      body: message.trim(),
      attachments: attachments.map((att: any) => ({
        filename: att.filename,
        url: att.url,
        mimeType: att.mimeType,
        size: att.size,
      })),
    });

    // Update thread: lastMessageAt, increment unreadByAdmin, reopen if closed
    await ConversationThread.findByIdAndUpdate(id, {
      $set: {
        lastMessageAt: new Date(),
        status: thread.status === "closed" ? "open" : thread.status,
      },
      $inc: { unreadByAdmin: 1 },
    });

    // Get customer details for email notification
    const customer = await Customer.findById(session.user.id).lean();

    // Send email notification to admin (async, don't wait)
    if (customer) {
      const adminEmail = process.env.EMAIL_ADMIN || "support@garderoba-pro.ro";
      sendNewMessageEmail({
        recipientEmail: adminEmail,
        recipientName: "Support Team",
        senderName: customer.name || customer.email,
        threadSubject: thread.subject,
        messageBody: message.trim(),
        threadId: id,
      }).catch((err) =>
        console.error("Failed to send admin notification:", err),
      );
    }

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
