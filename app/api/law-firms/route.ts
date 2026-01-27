// API route for law firms
// Uses mock data for development - will connect to GCP backend in production

import { type NextRequest, NextResponse } from "next/server"

const mockLawFirms = [
  {
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
  },
  {
    id: 2,
    uuid: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "Smith Legal Group",
    website: "https://smithlegal.com",
    headquarters_city: "Los Angeles",
    headquarters_state: "CA",
    firm_size: "medium",
    specialties: ["class_action", "mass_arbitration"],
    reputation_score: 88,
    created_at: "2024-02-20T14:30:00Z",
  },
  {
    id: 3,
    uuid: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    name: "Johnson & Partners",
    website: "https://johnsonpartners.com",
    headquarters_city: "Chicago",
    headquarters_state: "IL",
    firm_size: "biglaw",
    specialties: ["mass_tort", "product_liability"],
    reputation_score: 95,
    created_at: "2024-03-10T09:15:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    return NextResponse.json({
      success: true,
      data: mockLawFirms,
      pagination: {
        page,
        limit,
        total: mockLawFirms.length,
        totalPages: Math.ceil(mockLawFirms.length / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      success: true,
      data: { id: Date.now(), ...body },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
