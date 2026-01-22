import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Quote } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.eventType ||
      !data.dateFrom ||
      !data.attendees ||
      !data.location ||
      !data.name ||
      !data.email ||
      !data.phone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check honeypot (spam protection)
    if (data.honeypot) {
      return NextResponse.json(
        { error: "Spam detected" },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate quote number
    const quoteNumber = `QT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    // Map services array to boolean flags
    const services = data.services || [];
    
    // Insert quote into database
    const quote = await Quote.create({
      quoteNumber,
      eventType: data.eventType,
      eventName: data.eventName || `${data.eventType} Event`,
      startDate: data.dateFrom,
      endDate: data.dateTo || data.dateFrom,
      estimatedParticipants: data.attendees,
      location: data.location,
      notes: data.description,
      clientName: data.name,
      clientEmail: data.email,
      clientPhone: data.phone,
      clientCompany: data.company,
      needsCloakroom: services.includes('cloakroom'),
      needsVip: services.includes('vip'),
      needsBackstage: services.includes('backstage'),
      needsBagCheck: services.includes('bagcheck'),
      needsInfrastructure: services.includes('infrastructure'),
      constraints: data.budget ? `Budget: ${data.budget}${data.referral ? ` | Source: ${data.referral}` : ''}` : undefined,
      status: "new",
    });

    // TODO: Send confirmation email to client
    // TODO: Send notification email to admin

    return NextResponse.json(
      {
        success: true,
        quoteNumber: quote.quoteNumber,
        message: "Quote created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let query: any = {};
    if (status) {
      query.status = status;
    }

    const [quotes, total] = await Promise.all([
      Quote.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Quote.countDocuments(query),
    ]);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
