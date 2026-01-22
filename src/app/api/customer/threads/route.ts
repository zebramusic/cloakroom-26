import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { ConversationThread, Customer } from "@/lib/models-customer";
import mongoose from "mongoose";
import {
  sendNewThreadEmailToAdmin,
  sendThreadCreatedConfirmation,
} from "@/lib/email/messaging";

// GET /api/customer/threads - List customer's conversation threads
export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.principalType !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // open, closed, all
  const type = searchParams.get("type"); // order_support, general_support
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const filter: any = {
      customerId: new mongoose.Types.ObjectId(session.user.id),
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    const threads = await ConversationThread.find(filter)
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await ConversationThread.countDocuments(filter);

    return NextResponse.json({
      threads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 },
    );
  }
}

// POST /api/customer/threads - Create new conversation thread
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.principalType !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const { type, subject, orderId, initialMessage } = body;

    // Validate required fields
    if (!type || !subject || !initialMessage) {
      return NextResponse.json(
        { error: "Type, subject, and initial message are required" },
        { status: 400 },
      );
    }

    // Validate type
    if (!["order_support", "general_support"].includes(type)) {
      return NextResponse.json({ error: "Invalid thread type" }, { status: 400 });
    }

    // If order_support, orderId is required
    if (type === "order_support") {
      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json(
          { error: "Valid order ID is required for order support" },
          { status: 400 },
        );
      }
    }

    // Create the thread
    const thread = await ConversationThread.create({
      type,
      customerId: new mongoose.Types.ObjectId(session.user.id),
      orderId: orderId ? new mongoose.Types.ObjectId(orderId) : undefined,
      subject,
      status: "open",
      lastMessageAt: new Date(),
      unreadByCustomer: 0,
      unreadByAdmin: 1, // Initial message is unread by admin
    });

    // Import Message model dynamically to avoid circular dependencies
    const { Message } = await import("@/lib/models-customer");

    // Create the initial message
    await Message.create({
      threadId: thread._id,
      senderType: "customer",
      senderId: new mongoose.Types.ObjectId(session.user.id),
      body: initialMessage,
      attachments: [],
    });

    // Get customer details for email
    const customer = await Customer.findById(session.user.id).lean();

    // Send email notifications (async, don't wait)
    if (customer) {
      sendNewThreadEmailToAdmin({
        customerEmail: customer.email,
        customerName: customer.name || customer.email,
        subject,
        initialMessage,
        threadId: thread._id.toString(),
        type,
      }).catch((err) => console.error("Failed to send admin email:", err));

      sendThreadCreatedConfirmation({
        customerEmail: customer.email,
        customerName: customer.name || customer.email,
        subject,
        initialMessage,
        threadId: thread._id.toString(),
        type,
      }).catch((err) =>
        console.error("Failed to send confirmation email:", err),
      );
    }

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 },
    );
  }
}
