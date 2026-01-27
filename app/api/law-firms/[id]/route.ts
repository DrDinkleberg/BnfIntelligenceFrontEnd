// API route for individual law firm
// Uses mock data for development - will connect to GCP backend in production

import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

const mockLawFirm = {
  id: 1,
  uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  name: "Morgan & Associates",
  website: "https://morganlaw.com",
  headquarters_city: "New York",
  headquarters_state: "NY",
  firm_size: "large",
  specialties: ["mass_tort", "class_action"],
  reputation_score: 92,
  created_at: "2024-01-15T10:00:00Z",
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("law_firms").select("*").eq("id", params.id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ success: false, message: "Law firm not found" }, { status: 404 })
      }
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch law firm" }, { status: 500 })
    }

    // Use mock data for development
    return NextResponse.json({
      success: true,
      data: { ...mockLawFirm, id: params.id },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()

    const body = await request.json()

    const { data, error } = await supabase
      .from("law_firms")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Failed to update law firm" }, { status: 500 })
    }

    // Use mock data for development
    return NextResponse.json({
      success: true,
      data: { ...mockLawFirm, ...body, id: params.id, updated_at: new Date().toISOString() },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from("law_firms").delete().eq("id", params.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Failed to delete law firm" }, { status: 500 })
    }

    // Use mock data for development
    return NextResponse.json({
      success: true,
      message: "Law firm deleted successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
