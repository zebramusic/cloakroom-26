import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import connectDB from "@/lib/mongodb";
import { ConversationThread } from "@/lib/models-customer";
import mongoose from "mongoose";

// GET /api/admin/support/threads - List all customer threads
export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.principalType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, "support.view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // open, closed, all
  const type = searchParams.get("type"); // order_support, general_support
  const assignedTo = searchParams.get("assignedTo"); // userId or "unassigned"
  const search = searchParams.get("search"); // search in subject
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (assignedTo) {
      if (assignedTo === "unassigned") {
        filter.assignedTo = null;
      } else if (mongoose.Types.ObjectId.isValid(assignedTo)) {
        filter.assignedTo = new mongoose.Types.ObjectId(assignedTo);
      }
    }

    if (search) {
      filter.subject = { $regex: search, $options: "i" };
    }

    const threads = await ConversationThread.find(filter)
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await ConversationThread.countDocuments(filter);

    // Get unread counts
    const unreadCount = await ConversationThread.countDocuments({
      ...filter,
      unreadByAdmin: { $gt: 0 },
    });

    return NextResponse.json({
      threads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching support threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 },
    );
  }
}
