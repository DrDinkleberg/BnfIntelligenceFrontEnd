"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ContactList() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = 1247

  // Sample data based on your database schema
  const lawFirms = [
    {
      id: 1,
      uuid: "550e8400-e29b-41d4-a716-446655440001",
      name: "Morgan & Associates",
      website: "morganlaw.com",
      headquarters_city: "New York",
      headquarters_state: "NY",
      firm_size: "biglaw",
      specialties: ["mass_tort", "personal_injury", "class_action"],
      reputation_score: 8.5,
      activeCampaigns: 23,
      totalSpend: "$2.4M",
      lastActivity: "2 hours ago",
      riskScore: 85,
      starred: true,
      // Derived from firm_activity table
      activity_summary: {
        facebook_ads: 15,
        google_ads: 8,
        total_impressions: 2400000,
        targeting_entities: ["Zantac", "Roundup", "Juul"],
      },
    },
    {
      id: 2,
      uuid: "550e8400-e29b-41d4-a716-446655440002",
      name: "Johnson Legal Group",
      website: "johnsonlegal.com",
      headquarters_city: "Los Angeles",
      headquarters_state: "CA",
      firm_size: "large",
      specialties: ["class_action", "product_liability"],
      reputation_score: 7.2,
      activeCampaigns: 18,
      totalSpend: "$1.8M",
      lastActivity: "4 hours ago",
      riskScore: 72,
      starred: false,
      activity_summary: {
        facebook_ads: 12,
        google_ads: 6,
        total_impressions: 1800000,
        targeting_entities: ["Ford Explorer", "Medical Devices"],
      },
    },
    {
      id: 3,
      uuid: "550e8400-e29b-41d4-a716-446655440003",
      name: "Smith & Partners",
      website: "smithpartners.com",
      headquarters_city: "Chicago",
      headquarters_state: "IL",
      firm_size: "medium",
      specialties: ["medical_malpractice", "personal_injury"],
      reputation_score: 6.8,
      activeCampaigns: 12,
      totalSpend: "$950K",
      lastActivity: "6 hours ago",
      riskScore: 68,
      starred: true,
      activity_summary: {
        facebook_ads: 8,
        google_ads: 4,
        total_impressions: 950000,
        targeting_entities: ["Medical Devices", "Pharmaceuticals"],
      },
    },
    {
      id: 4,
      uuid: "550e8400-e29b-41d4-a716-446655440004",
      name: "Davis Law Firm",
      website: "davislaw.com",
      headquarters_city: "Houston",
      headquarters_state: "TX",
      firm_size: "large",
      specialties: ["mass_tort", "environmental_law"],
      reputation_score: 9.1,
      activeCampaigns: 31,
      totalSpend: "$3.2M",
      lastActivity: "1 hour ago",
      riskScore: 91,
      starred: false,
      activity_summary: {
        facebook_ads: 20,
        google_ads: 11,
        total_impressions: 3200000,
        targeting_entities: ["PFAS", "Roundup", "Environmental"],
      },
    },
    {
      id: 5,
      uuid: "550e8400-e29b-41d4-a716-446655440005",
      name: "Wilson Legal Services",
      website: "wilsonlegal.com",
      headquarters_city: "Miami",
      headquarters_state: "FL",
      firm_size: "medium",
      specialties: ["personal_injury", "class_action"],
      reputation_score: 7.6,
      activeCampaigns: 15,
      totalSpend: "$1.2M",
      lastActivity: "3 hours ago",
      riskScore: 76,
      starred: false,
      activity_summary: {
        facebook_ads: 10,
        google_ads: 5,
        total_impressions: 1200000,
        targeting_entities: ["Vehicle Recalls", "Consumer Products"],
      },
    },
  ]

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const getRiskScoreColor = (score: number) => {
    if (score >= 85) return "bg-red-100 text-red-800"
    if (score >= 70) return "bg-orange-100 text-orange-800"
    if (score >= 40) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const getRiskScoreLabel = (score: number) => {
    if (score >= 85) return "Critical"
    if (score >= 70) return "High"
    if (score >= 40) return "Medium"
    return "Low"
  }

  const getFirmSizeLabel = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      solo: "Solo",
      small: "Small",
      medium: "Medium",
      large: "Large",
      biglaw: "BigLaw",
    }
    return sizeMap[size] || size
  }

  const formatSpecialties = (specialties: string[]) => {
    return specialties.map((specialty) =>
      specialty
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {lawFirms.map((firm) => (
          <div key={firm.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`/placeholder.svg?height=48&width=48&text=${firm.name.charAt(0)}`}
                    alt={firm.name}
                  />
                  <AvatarFallback>
                    {firm.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{firm.name}</h3>
                    <button>
                      <Star
                        className={`h-4 w-4 ${firm.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                      />
                    </button>
                    <ExternalLink className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                  <p className="text-gray-600 mb-3">
                    {firm.headquarters_city}, {firm.headquarters_state} • {firm.website}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getRiskScoreColor(firm.riskScore)}>
                      {getRiskScoreLabel(firm.riskScore)} Risk ({firm.riskScore})
                    </Badge>
                    <Badge variant="outline">{getFirmSizeLabel(firm.firm_size)}</Badge>
                    {formatSpecialties(firm.specialties).map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Active Campaigns:</span>
                      <span className="font-medium ml-1">{firm.activeCampaigns}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Spend:</span>
                      <span className="font-medium ml-1">{firm.totalSpend}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Reputation:</span>
                      <span className="font-medium ml-1">{firm.reputation_score}/10</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Activity:</span>
                      <span className="font-medium ml-1">{firm.lastActivity}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>Targeting: {firm.activity_summary.targeting_entities.join(", ")}</span>
                      <span>•</span>
                      <span>{firm.activity_summary.total_impressions.toLocaleString()} impressions</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
          {totalItems} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex gap-1">
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
