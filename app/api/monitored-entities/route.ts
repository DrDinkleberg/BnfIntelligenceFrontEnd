// API route for monitored entities
// Uses mock data for development - will connect to GCP backend in production

import { type NextRequest, NextResponse } from "next/server"

const mockEntities = [
  {
    id: 1,
    uuid: "e1f2g3h4-i5j6-7890-klmn-op1234567890",
    name: "Ozempic",
    type: "drug",
    description: "GLP-1 receptor agonist for diabetes and weight loss",
    company_name: "Novo Nordisk",
    status: "active",
    risk_assessments: {
      risk_score: 78,
      risk_category: "high",
      assessed_at: "2024-01-20T10:00:00Z",
    },
  },
  {
    id: 2,
    uuid: "f2g3h4i5-j6k7-8901-lmno-pq2345678901",
    name: "PFAS Chemicals",
    type: "product",
    description: "Per- and polyfluoroalkyl substances found in water",
    company_name: "3M Company",
    status: "active",
    risk_assessments: {
      risk_score: 92,
      risk_category: "critical",
      assessed_at: "2024-01-22T14:30:00Z",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    return NextResponse.json({
      success: true,
      data: mockEntities,
      pagination: {
        page,
        limit,
        total: mockEntities.length,
        totalPages: Math.ceil(mockEntities.length / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
