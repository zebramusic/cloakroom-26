import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface QuoteResponse {
  quote_number: string
  id: string
  [key: string]: any
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

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
      )
    }

    // Check honeypot (spam protection)
    if (data.honeypot) {
      return NextResponse.json(
        { error: "Spam detected" },
        { status: 400 }
      )
    }

    // Generate quote number
    const quoteNumber = `QT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

    // Create Supabase client
    const supabase = await createClient()

    // Map services array to boolean flags
    const services = data.services || []
    
    // Insert quote into database
    const { data: quote, error } = await (supabase
      .from("quotes") as any)
      .insert({
        quote_number: quoteNumber,
        event_type: data.eventType,
        event_name: data.eventName || `${data.eventType} Event`,
        start_date: data.dateFrom,
        end_date: data.dateTo || data.dateFrom,
        estimated_participants: data.attendees,
        location: data.location,
        notes: data.description,
        client_name: data.name,
        client_email: data.email,
        client_phone: data.phone,
        client_company: data.company,
        needs_cloakroom: services.includes('cloakroom'),
        needs_vip: services.includes('vip'),
        needs_backstage: services.includes('backstage'),
        needs_bag_check: services.includes('bagcheck'),
        needs_infrastructure: services.includes('infrastructure'),
        constraints: data.budget ? `Budget: ${data.budget}${data.referral ? ` | Source: ${data.referral}` : ''}` : null,
        status: "new" as const,
      })
      .select()
      .single() as { data: QuoteResponse | null; error: any }

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to create quote" },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email to client
    // TODO: Send notification email to admin

    return NextResponse.json(
      {
        success: true,
        quoteNumber: quote?.quote_number || quoteNumber,
        message: "Quote created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error processing quote:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = supabase
      .from("quotes")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: quotes, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to fetch quotes" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
