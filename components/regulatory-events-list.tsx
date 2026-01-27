"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, AlertTriangle, Clock, Search, Filter, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const agencies = ["FDA", "EPA", "NHTSA", "CDC", "DOJ", "FTC", "SEC"]
const severities = ["Critical", "High", "Medium", "Low"]
const statuses = ["Active", "Ongoing", "Under Review", "Completed"]
const eventTypes = ["Warning Letter", "Investigation", "Proposed Rule", "Health Advisory", "Product Recall"]

const trendingEvents = [
  { keyword: "PFAS Regulations", growth: 156, agency: "EPA" },
  { keyword: "Drug Recalls", growth: 89, agency: "FDA" },
  { keyword: "Vehicle Safety", growth: 67, agency: "NHTSA" },
  { keyword: "Data Privacy", growth: 145, agency: "FTC" },
  { keyword: "Opioid Litigation", growth: 112, agency: "DOJ" },
]

export default function RegulatoryEventsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([])
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const itemsPerPage = 10

  const events = [
    {
      id: 1,
      title: "FDA Issues Warning Letter to Pharmaceutical Company",
      description: "FDA warns company about manufacturing violations affecting drug safety",
      agency: "FDA",
      eventType: "Warning Letter",
      severity: "High",
      date: "2024-01-15",
      affectedEntities: ["Zantac", "Generic Ranitidine"],
      impactedFirms: 45,
      status: "Active",
      source: "FDA.gov",
    },
    {
      id: 2,
      title: "EPA Proposes New Glyphosate Restrictions",
      description: "Environmental Protection Agency proposes stricter regulations on glyphosate use",
      agency: "EPA",
      eventType: "Proposed Rule",
      severity: "Medium",
      date: "2024-01-12",
      affectedEntities: ["Roundup", "Glyphosate Products"],
      impactedFirms: 23,
      status: "Under Review",
      source: "EPA.gov",
    },
    {
      id: 3,
      title: "NHTSA Opens Investigation into Vehicle Defects",
      description: "National Highway Traffic Safety Administration investigates reported safety issues",
      agency: "NHTSA",
      eventType: "Investigation",
      severity: "High",
      date: "2024-01-10",
      affectedEntities: ["Ford Explorer", "SUV Models"],
      impactedFirms: 18,
      status: "Ongoing",
      source: "NHTSA.gov",
    },
    {
      id: 4,
      title: "CDC Issues Health Advisory",
      description: "Centers for Disease Control issues advisory on vaping-related lung injuries",
      agency: "CDC",
      eventType: "Health Advisory",
      severity: "Critical",
      date: "2024-01-08",
      affectedEntities: ["Juul E-Cigarette", "Vaping Products"],
      impactedFirms: 67,
      status: "Active",
      source: "CDC.gov",
    },
    {
      id: 5,
      title: "Medical Device Recall Announced",
      description: "Voluntary recall of hip implant devices due to reported complications",
      agency: "FDA",
      eventType: "Product Recall",
      severity: "High",
      date: "2024-01-05",
      affectedEntities: ["Hip Implants", "Medical Devices"],
      impactedFirms: 34,
      status: "Completed",
      source: "FDA.gov",
    },
    {
      id: 6,
      title: "DOJ Investigates Pharmaceutical Price Fixing",
      description: "Department of Justice opens investigation into potential price-fixing schemes",
      agency: "DOJ",
      eventType: "Investigation",
      severity: "Critical",
      date: "2024-01-03",
      affectedEntities: ["Generic Drugs", "Insulin Products"],
      impactedFirms: 89,
      status: "Ongoing",
      source: "DOJ.gov",
    },
    {
      id: 7,
      title: "FTC Warns Companies About Deceptive Marketing",
      description: "Federal Trade Commission issues warning about misleading health claims",
      agency: "FTC",
      eventType: "Warning Letter",
      severity: "Medium",
      date: "2024-01-02",
      affectedEntities: ["Supplement Companies", "Health Products"],
      impactedFirms: 42,
      status: "Active",
      source: "FTC.gov",
    },
    {
      id: 8,
      title: "SEC Files Charges Against Crypto Exchange",
      description: "Securities and Exchange Commission charges exchange with securities violations",
      agency: "SEC",
      eventType: "Investigation",
      severity: "High",
      date: "2023-12-28",
      affectedEntities: ["Crypto Exchange", "Digital Assets"],
      impactedFirms: 56,
      status: "Ongoing",
      source: "SEC.gov",
    },
  ]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.affectedEntities.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesAgency = selectedAgencies.length === 0 || selectedAgencies.includes(event.agency)
    const matchesSeverity = selectedSeverities.length === 0 || selectedSeverities.includes(event.severity)
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(event.status)
    const matchesEventType = selectedEventTypes.length === 0 || selectedEventTypes.includes(event.eventType)

    return matchesSearch && matchesAgency && matchesSeverity && matchesStatus && matchesEventType
  })

  const totalItems = filteredEvents.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Ongoing":
        return "bg-blue-100 text-blue-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "Warning Letter":
      case "Health Advisory":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "Investigation":
      case "Proposed Rule":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex gap-6 p-4">
      {/* Filter Sidebar - Same width as other tabs (w-64) */}
      <div className={`w-64 shrink-0 space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* Agency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Agency</label>
              <div className="space-y-1">
                {agencies.map((agency) => (
                  <div key={agency} className="flex items-center gap-2">
                    <Checkbox
                      id={`agency-${agency}`}
                      checked={selectedAgencies.includes(agency)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAgencies([...selectedAgencies, agency])
                        } else {
                          setSelectedAgencies(selectedAgencies.filter((a) => a !== agency))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`agency-${agency}`} className="text-sm cursor-pointer">
                      {agency}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <div className="space-y-1">
                {severities.map((severity) => (
                  <div key={severity} className="flex items-center gap-2">
                    <Checkbox
                      id={`severity-${severity}`}
                      checked={selectedSeverities.includes(severity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSeverities([...selectedSeverities, severity])
                        } else {
                          setSelectedSeverities(selectedSeverities.filter((s) => s !== severity))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`severity-${severity}`} className="text-sm cursor-pointer">
                      {severity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="space-y-1">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStatuses([...selectedStatuses, status])
                        } else {
                          setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <div className="space-y-1">
                {eventTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedEventTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEventTypes([...selectedEventTypes, type])
                        } else {
                          setSelectedEventTypes(selectedEventTypes.filter((t) => t !== type))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full h-9 text-sm bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setSelectedAgencies([])
                setSelectedSeverities([])
                setSelectedStatuses([])
                setSelectedEventTypes([])
                setCurrentPage(1)
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>

        {/* Trending Events Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Trending Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              {trendingEvents.map((event, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-between h-auto py-1.5 bg-transparent text-xs"
                  onClick={() => {
                    setSearchQuery(event.keyword)
                    setCurrentPage(1)
                  }}
                >
                  <span className="text-xs truncate">{event.keyword}</span>
                  <Badge
                    className={`text-xs ml-1 ${event.growth > 100 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    +{event.growth}%
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-medium">{totalItems} regulatory events</span>
          </div>
          <Badge variant="secondary">Last updated: Today</Badge>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {paginatedEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getEventTypeIcon(event.eventType)}
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <ExternalLink className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                    <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                    <Badge variant="outline">{event.agency}</Badge>
                    <Badge variant="outline">{event.eventType}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Date: {formatDate(event.date)}</span>
                    <span>Affected: {event.affectedEntities.join(", ")}</span>
                    <span>Impacted Firms: {event.impactedFirms}</span>
                    <span>Source: {event.source}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-transparent"
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
                  className={`w-8 h-8 p-0 ${currentPage !== page ? "bg-transparent" : ""}`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="bg-transparent"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
