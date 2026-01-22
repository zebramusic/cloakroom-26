import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { Customer } from "@/lib/models-customer";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    // Must be authenticated as the customer themselves or as admin
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Customer can only access their own data (unless admin)
    if (
      session.user.principalType === "customer" &&
      session.user.id !== id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
    }

    await connectDB();

    const customer = await Customer.findById(id).lean();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Remove sensitive data
    const { passwordHash, emailVerificationToken, passwordResetToken, ...safeCustomer } = customer;

    return NextResponse.json({ customer: safeCustomer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer data" },
      { status: 500 }
    );
  }
}
