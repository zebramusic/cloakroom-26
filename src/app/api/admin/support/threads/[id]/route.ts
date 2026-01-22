import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import connectDB from "@/lib/mongodb";
import { ConversationThread, Message, Customer } from "@/lib/models-customer";
import mongoose from "mongoose";
import { sendNewMessageEmail } from "@/lib/email/messaging";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/support/threads/[id] - Get thread details with messages
export async function GET(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session || session.user.principalType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, "support.view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
  }

  await connectDB();

  try {
    const thread = await ConversationThread.findById(id).lean();

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Get customer details
    const customer = await Customer.findById(thread.customerId).lean();

    // Get messages
    const messages = await Message.find({
      threadId: new mongoose.Types.ObjectId(id),
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read by admin
    await Message.updateMany(
      {
        threadId: new mongoose.Types.ObjectId(id),
        senderType: "customer",
        readAt: null,
      },
      {
        $set: { readAt: new Date() },
      },
    );

    // Update unread count for admin
    await ConversationThread.findByIdAndUpdate(id, {
      $set: { unreadByAdmin: 0 },
    });

    return NextResponse.json({
      thread,
      customer: customer
        ? {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            companyName: customer.companyName,
            phone: customer.phone,
          }
        : null,
      messages,
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 },
    );
  }
}

// POST /api/admin/support/threads/[id]/messages - Send message as admin
export async function POST(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session || session.user.principalType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, "support.respond")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    // Get thread and customer
    const thread = await ConversationThread.findById(id);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const customer = await Customer.findById(thread.customerId).lean();
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
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
      senderType: "admin",
      senderId: new mongoose.Types.ObjectId(session.user.id),
      body: message.trim(),
      attachments: attachments.map((att: any) => ({
        filename: att.filename,
        url: att.url,
        mimeType: att.mimeType,
        size: att.size,
      })),
    });

    // Update thread
    await ConversationThread.findByIdAndUpdate(id, {
      $set: {
        lastMessageAt: new Date(),
        status: "open",
      },
      $inc: { unreadByCustomer: 1 },
    });

    // Send email notification to customer (async)
    sendNewMessageEmail({
      recipientEmail: customer.email,
      recipientName: customer.name || customer.email,
      senderName: "Support Team",
      threadSubject: thread.subject,
      messageBody: message.trim(),
      threadId: id,
    }).catch((err) =>
      console.error("Failed to send customer notification:", err),
    );

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/support/threads/[id] - Update thread (assign, status)
export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session || session.user.principalType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, "support.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const { assignedTo, status } = body;

    const updateData: any = {};

    if (assignedTo !== undefined) {
      if (assignedTo === null) {
        updateData.assignedTo = null;
      } else if (mongoose.Types.ObjectId.isValid(assignedTo)) {
        updateData.assignedTo = new mongoose.Types.ObjectId(assignedTo);
      } else {
        return NextResponse.json(
          { error: "Invalid assignedTo value" },
          { status: 400 },
        );
      }
    }

    if (status) {
      if (!["open", "closed"].includes(status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
      updateData.status = status;
    }

    const thread = await ConversationThread.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).lean();

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error updating thread:", error);
    return NextResponse.json(
      { error: "Failed to update thread" },
      { status: 500 },
    );
  }
}
