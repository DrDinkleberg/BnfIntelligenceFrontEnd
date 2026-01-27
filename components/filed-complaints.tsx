"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ExternalLink,
  FileText,
  Building2,
  Scale,
  Calendar,
  Users,
  DollarSign,
  Gavel,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const courtTypes = ["Federal", "State", "Bankruptcy", "Appellate"]
const caseTypes = ["Class Action", "Mass Tort", "Individual", "MDL", "Arbitration"]
const caseStatuses = ["Filed", "Pending", "Discovery", "Trial", "Settled", "Dismissed"]
const practiceAreas = ["Mass Torts", "Class Action", "Personal Injury", "Product Liability", "Securities"]

// Mock data for filed complaints
const mockFiledComplaints = [
  {
    id: 1,
    uuid: "fc-001",
    firm_id: 1,
    firm_name: "Morgan & Morgan",
    case_number: "1:24-cv-00123",
    case_title: "Smith et al. v. PharmaCorp Inc.",
    court_name: "U.S. District Court, Southern District of Florida",
    court_type: "federal" as const,
    jurisdiction: "Florida",
    filing_date: "2024-01-15",
    case_type: "mass_tort" as const,
    practice_area: "Mass Torts",
    defendant_name: "PharmaCorp Inc.",
    plaintiff_count: 2500,
    alleged_damages: 500000000,
    case_status: "discovery" as const,
    description:
      "Plaintiffs allege that the defendant's medication caused severe liver damage and other adverse health effects.",
    key_allegations: ["Product defect", "Failure to warn", "Negligence", "Strict liability"],
    related_entities: ["PharmaCorp Drug X", "Generic Manufacturers"],
    lead_counsel: "John Morgan",
    co_counsel: ["Partner A", "Partner B"],
    judge_name: "Hon. Sarah Johnson",
    next_hearing_date: "2024-03-15",
    document_url: "https://pacer.gov/case/123",
    pacer_link: "https://pacer.gov/case/123",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z",
  },
  {
    id: 2,
    uuid: "fc-002",
    firm_id: 2,
    firm_name: "Ben Crump Law",
    case_number: "2:24-cv-00456",
    case_title: "Johnson v. AutoMaker Corp.",
    court_name: "U.S. District Court, Eastern District of Michigan",
    court_type: "federal" as const,
    jurisdiction: "Michigan",
    filing_date: "2024-01-12",
    case_type: "class_action" as const,
    practice_area: "Class Action",
    defendant_name: "AutoMaker Corp.",
    plaintiff_count: 15000,
    alleged_damages: 1200000000,
    case_status: "pending" as const,
    description: "Class action alleging defective airbag deployment systems resulting in injuries and deaths.",
    key_allegations: ["Design defect", "Manufacturing defect", "Wrongful death", "Personal injury"],
    related_entities: ["AutoMaker SUV Line", "Airbag Systems Inc."],
    lead_counsel: "Ben Crump",
    judge_name: "Hon. Michael Chen",
    next_hearing_date: "2024-02-28",
    document_url: "https://pacer.gov/case/456",
    pacer_link: "https://pacer.gov/case/456",
    created_at: "2024-01-12T09:00:00Z",
    updated_at: "2024-01-18T11:00:00Z",
  },
  {
    id: 3,
    uuid: "fc-003",
    firm_id: 3,
    firm_name: "Weitz & Luxenberg",
    case_number: "MDL 3024",
    case_title: "In re: PFAS Water Contamination Litigation",
    court_name: "U.S. District Court, District of South Carolina",
    court_type: "federal" as const,
    jurisdiction: "South Carolina",
    filing_date: "2024-01-08",
    case_type: "mdl" as const,
    practice_area: "Mass Torts",
    defendant_name: "ChemCorp Industries",
    plaintiff_count: 45000,
    alleged_damages: 8500000000,
    case_status: "discovery" as const,
    description:
      "Multi-district litigation involving PFAS contamination of drinking water supplies affecting communities nationwide.",
    key_allegations: ["Environmental contamination", "Public nuisance", "Negligence", "Failure to warn"],
    related_entities: ["PFAS Chemicals", "Water Treatment Facilities"],
    lead_counsel: "Perry Weitz",
    co_counsel: ["Environmental Law Group", "Mass Tort Associates"],
    judge_name: "Hon. Richard Gergel",
    next_hearing_date: "2024-04-10",
    document_url: "https://pacer.gov/mdl/3024",
    pacer_link: "https://pacer.gov/mdl/3024",
    created_at: "2024-01-08T14:00:00Z",
    updated_at: "2024-01-22T09:30:00Z",
  },
  {
    id: 4,
    uuid: "fc-004",
    firm_id: 4,
    firm_name: "Napoli Shkolnik",
    case_number: "1:24-cv-00789",
    case_title: "Williams v. Social Media Corp.",
    court_name: "U.S. District Court, Northern District of California",
    court_type: "federal" as const,
    jurisdiction: "California",
    filing_date: "2024-01-05",
    case_type: "class_action" as const,
    practice_area: "Product Liability",
    defendant_name: "Social Media Corp.",
    plaintiff_count: 8500,
    alleged_damages: 2000000000,
    case_status: "filed" as const,
    description: "Class action alleging social media platform's algorithms caused mental health harm to minors.",
    key_allegations: ["Product liability", "Negligence", "COPPA violations", "Unfair business practices"],
    related_entities: ["Social Platform X", "Minor Users"],
    lead_counsel: "Paul Napoli",
    judge_name: "Hon. James Donato",
    next_hearing_date: "2024-02-15",
    document_url: "https://pacer.gov/case/789",
    pacer_link: "https://pacer.gov/case/789",
    created_at: "2024-01-05T11:00:00Z",
    updated_at: "2024-01-15T16:00:00Z",
  },
  {
    id: 5,
    uuid: "fc-005",
    firm_id: 5,
    firm_name: "Levin Papantonio",
    case_number: "3:23-cv-01234",
    case_title: "Davis v. Medical Device Inc.",
    court_name: "U.S. District Court, Middle District of Florida",
    court_type: "federal" as const,
    jurisdiction: "Florida",
    filing_date: "2023-12-20",
    case_type: "mass_tort" as const,
    practice_area: "Mass Torts",
    defendant_name: "Medical Device Inc.",
    plaintiff_count: 12000,
    alleged_damages: 3500000000,
    case_status: "trial" as const,
    description: "Mass tort litigation involving defective hip implant devices causing severe complications.",
    key_allegations: ["Design defect", "Manufacturing defect", "Failure to warn", "Fraud"],
    related_entities: ["Hip Implant Model X", "Orthopedic Surgeons"],
    lead_counsel: "Mike Papantonio",
    judge_name: "Hon. Casey Rodgers",
    next_hearing_date: "2024-01-30",
    settlement_amount: 750000000,
    document_url: "https://pacer.gov/case/1234",
    pacer_link: "https://pacer.gov/case/1234",
    created_at: "2023-12-20T10:00:00Z",
    updated_at: "2024-01-25T14:00:00Z",
  },
]

export default function FiledComplaints() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourtTypes, setSelectedCourtTypes] = useState<string[]>([])
  const [selectedCaseTypes, setSelectedCaseTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<(typeof mockFiledComplaints)[0] | null>(null)
  const itemsPerPage = 10

  const filteredComplaints = mockFiledComplaints.filter((complaint) => {
    const matchesSearch =
      searchQuery === "" ||
      complaint.firm_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.case_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.defendant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.case_number.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCourtType =
      selectedCourtTypes.length === 0 || selectedCourtTypes.some((t) => t.toLowerCase() === complaint.court_type)
    const matchesCaseType =
      selectedCaseTypes.length === 0 ||
      selectedCaseTypes.some((t) => t.toLowerCase().replace(" ", "_") === complaint.case_type)
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.some((s) => s.toLowerCase() === complaint.case_status)
    const matchesPracticeArea =
      selectedPracticeAreas.length === 0 || selectedPracticeAreas.includes(complaint.practice_area)

    return matchesSearch && matchesCourtType && matchesCaseType && matchesStatus && matchesPracticeArea
  })

  const totalItems = filteredComplaints.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedComplaints = filteredComplaints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "discovery":
        return "bg-purple-100 text-purple-800"
      case "trial":
        return "bg-orange-100 text-orange-800"
      case "settled":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCaseTypeColor = (caseType: string) => {
    switch (caseType) {
      case "class_action":
        return "bg-blue-100 text-blue-800"
      case "mass_tort":
        return "bg-purple-100 text-purple-800"
      case "mdl":
        return "bg-orange-100 text-orange-800"
      case "arbitration":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(0)}M`
    return `$${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
                  placeholder="Search firm, case, defendant..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* Court Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Court Type</label>
              <div className="space-y-1">
                {courtTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`court-${type}`}
                      checked={selectedCourtTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCourtTypes([...selectedCourtTypes, type])
                        } else {
                          setSelectedCourtTypes(selectedCourtTypes.filter((t) => t !== type))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`court-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Case Type</label>
              <div className="space-y-1">
                {caseTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`case-${type}`}
                      checked={selectedCaseTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCaseTypes([...selectedCaseTypes, type])
                        } else {
                          setSelectedCaseTypes(selectedCaseTypes.filter((t) => t !== type))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`case-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Case Status</label>
              <div className="space-y-1">
                {caseStatuses.map((status) => (
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

            {/* Practice Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Practice Area</label>
              <div className="space-y-1">
                {practiceAreas.map((area) => (
                  <div key={area} className="flex items-center gap-2">
                    <Checkbox
                      id={`area-${area}`}
                      checked={selectedPracticeAreas.includes(area)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPracticeAreas([...selectedPracticeAreas, area])
                        } else {
                          setSelectedPracticeAreas(selectedPracticeAreas.filter((a) => a !== area))
                        }
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor={`area-${area}`} className="text-sm cursor-pointer">
                      {area}
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
                setSelectedCourtTypes([])
                setSelectedCaseTypes([])
                setSelectedStatuses([])
                setSelectedPracticeAreas([])
                setCurrentPage(1)
              }}
            >
              Clear All Filters
            </Button>
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
            <Gavel className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{totalItems} filed complaints</span>
          </div>
          <Badge variant="secondary">Last updated: Today</Badge>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {paginatedComplaints.map((complaint) => (
            <Card
              key={complaint.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedComplaint(complaint)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{complaint.case_number}</span>
                      <Badge className={getStatusColor(complaint.case_status)}>{complaint.case_status}</Badge>
                      <Badge className={getCaseTypeColor(complaint.case_type)}>
                        {complaint.case_type.replace("_", " ")}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{complaint.case_title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{complaint.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {complaint.firm_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        {complaint.court_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Filed: {formatDate(complaint.filing_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {complaint.plaintiff_count.toLocaleString()} plaintiffs
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(complaint.alleged_damages)}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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

      {/* Complaint Detail Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  {selectedComplaint.case_number}
                </DialogTitle>
                <DialogDescription>{selectedComplaint.case_title}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(selectedComplaint.case_status)}>
                    {selectedComplaint.case_status}
                  </Badge>
                  <Badge className={getCaseTypeColor(selectedComplaint.case_type)}>
                    {selectedComplaint.case_type.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline">{selectedComplaint.practice_area}</Badge>
                  <Badge variant="outline">{selectedComplaint.court_type}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Filing Firm</p>
                    <p className="font-medium">{selectedComplaint.firm_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lead Counsel</p>
                    <p className="font-medium">{selectedComplaint.lead_counsel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Defendant</p>
                    <p className="font-medium">{selectedComplaint.defendant_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Judge</p>
                    <p className="font-medium">{selectedComplaint.judge_name || "TBD"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plaintiffs</p>
                    <p className="font-medium">{selectedComplaint.plaintiff_count.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alleged Damages</p>
                    <p className="font-medium">{formatCurrency(selectedComplaint.alleged_damages)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Filing Date</p>
                    <p className="font-medium">{formatDate(selectedComplaint.filing_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Hearing</p>
                    <p className="font-medium">
                      {selectedComplaint.next_hearing_date
                        ? formatDate(selectedComplaint.next_hearing_date)
                        : "Not scheduled"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Court</p>
                  <p>{selectedComplaint.court_name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700">{selectedComplaint.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Key Allegations</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedComplaint.key_allegations.map((allegation) => (
                      <Badge key={allegation} variant="outline">
                        {allegation}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedComplaint.document_url && (
                    <Button variant="outline" className="bg-transparent" asChild>
                      <a href={selectedComplaint.document_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Documents
                      </a>
                    </Button>
                  )}
                  {selectedComplaint.pacer_link && (
                    <Button variant="outline" className="bg-transparent" asChild>
                      <a href={selectedComplaint.pacer_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        PACER
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
