import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: quote, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Build update object with explicit fields
    const updateData: any = {}
    
    if (body.status !== undefined) updateData.status = body.status
    if (body.total_price !== undefined) updateData.total_price = body.total_price
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.responded_at !== undefined) updateData.responded_at = body.responded_at

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    const { data: quote, error } = (await (supabase.from("quotes") as any)
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()) as any

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to update quote" },
        { status: 500 }
      )
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to delete quote" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
