"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, ExternalLink, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function MonitoredEntitiesList() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = 4892

  const entities = [
    {
      id: 1,
      name: "Zantac (Ranitidine)",
      category: "Pharmaceutical",
      riskLevel: "Critical",
      activeFirms: 156,
      totalCampaigns: 342,
      adSpend: "$12.4M",
      trend: "up",
      trendPercentage: 23,
      lastUpdate: "2 hours ago",
      description: "Heartburn medication linked to cancer risks",
    },
    {
      id: 2,
      name: "Roundup (Glyphosate)",
      category: "Agricultural",
      riskLevel: "High",
      activeFirms: 89,
      totalCampaigns: 198,
      adSpend: "$8.7M",
      trend: "down",
      trendPercentage: 12,
      lastUpdate: "4 hours ago",
      description: "Herbicide associated with non-Hodgkin's lymphoma",
    },
    {
      id: 3,
      name: "Juul E-Cigarette",
      category: "Consumer Product",
      riskLevel: "High",
      activeFirms: 67,
      totalCampaigns: 145,
      adSpend: "$5.2M",
      trend: "up",
      trendPercentage: 8,
      lastUpdate: "1 hour ago",
      description: "Vaping device linked to lung injuries and addiction",
    },
    {
      id: 4,
      name: "Ford Explorer",
      category: "Automotive",
      riskLevel: "Medium",
      activeFirms: 34,
      totalCampaigns: 78,
      adSpend: "$2.1M",
      trend: "up",
      trendPercentage: 15,
      lastUpdate: "6 hours ago",
      description: "SUV model with reported rollover issues",
    },
    {
      id: 5,
      name: "Medical Devices - Hip Implants",
      category: "Medical Device",
      riskLevel: "High",
      activeFirms: 78,
      totalCampaigns: 167,
      adSpend: "$6.8M",
      trend: "down",
      trendPercentage: 5,
      lastUpdate: "3 hours ago",
      description: "Defective hip implants causing complications",
    },
  ]

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Pharmaceutical":
        return "bg-blue-100 text-blue-800"
      case "Agricultural":
        return "bg-green-100 text-green-800"
      case "Consumer Product":
        return "bg-purple-100 text-purple-800"
      case "Automotive":
        return "bg-gray-100 text-gray-800"
      case "Medical Device":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        {entities.map((entity) => (
          <div key={entity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{entity.name}</h3>
                  <ExternalLink className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                <p className="text-gray-600 mb-3 text-sm">{entity.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getRiskLevelColor(entity.riskLevel)}>{entity.riskLevel} Risk</Badge>
                  <Badge className={getCategoryColor(entity.category)}>{entity.category}</Badge>
                  <div className="flex items-center gap-1">
                    {entity.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs ${entity.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {entity.trendPercentage}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Active Firms:</span>
                    <span className="font-medium ml-1">{entity.activeFirms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Campaigns:</span>
                    <span className="font-medium ml-1">{entity.totalCampaigns}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ad Spend:</span>
                    <span className="font-medium ml-1">{entity.adSpend}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Update:</span>
                    <span className="font-medium ml-1">{entity.lastUpdate}</span>
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
