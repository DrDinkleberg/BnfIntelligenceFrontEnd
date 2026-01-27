"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FilterSidebar() {
  const [riskScoreFilters, setRiskScoreFilters] = useState<string[]>(["High (70-84)", "Critical (85+)"])
  const [firmSizeFilters, setFirmSizeFilters] = useState<string[]>(["Large"])
  const [practiceAreaFilters, setPracticeAreaFilters] = useState<string[]>([])
  const [locationFilters, setLocationFilters] = useState<string[]>([])
  const [activityFilters, setActivityFilters] = useState<string[]>([])
  const [entityFilters, setEntityFilters] = useState<string[]>([])
  const [adPlatformFilters, setAdPlatformFilters] = useState<string[]>([])

  const removeRiskFilter = (filter: string) => {
    setRiskScoreFilters(riskScoreFilters.filter((f) => f !== filter))
  }

  const removeFirmSizeFilter = (filter: string) => {
    setFirmSizeFilters(firmSizeFilters.filter((f) => f !== filter))
  }

  const togglePracticeAreaFilter = (filter: string) => {
    if (practiceAreaFilters.includes(filter)) {
      setPracticeAreaFilters(practiceAreaFilters.filter((f) => f !== filter))
    } else {
      setPracticeAreaFilters([...practiceAreaFilters, filter])
    }
  }

  const toggleLocationFilter = (filter: string) => {
    if (locationFilters.includes(filter)) {
      setLocationFilters(locationFilters.filter((f) => f !== filter))
    } else {
      setLocationFilters([...locationFilters, filter])
    }
  }

  const toggleActivityFilter = (filter: string) => {
    if (activityFilters.includes(filter)) {
      setActivityFilters(activityFilters.filter((f) => f !== filter))
    } else {
      setActivityFilters([...activityFilters, filter])
    }
  }

  const toggleEntityFilter = (filter: string) => {
    if (entityFilters.includes(filter)) {
      setEntityFilters(entityFilters.filter((f) => f !== filter))
    } else {
      setEntityFilters([...entityFilters, filter])
    }
  }

  const toggleAdPlatformFilter = (filter: string) => {
    if (adPlatformFilters.includes(filter)) {
      setAdPlatformFilters(adPlatformFilters.filter((f) => f !== filter))
    } else {
      setAdPlatformFilters([...adPlatformFilters, filter])
    }
  }

  return (
    <div className="w-full border rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Filters</span>
          <Badge className="bg-gray-200 text-gray-800 rounded-md">(6)</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="text-blue-600 h-8 px-2 text-xs sm:text-sm">
            Clear filters
          </Button>
          <Button variant="ghost" className="text-gray-800 h-8 px-2 text-xs sm:text-sm">
            Save search
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={["risk-score", "firm-size"]}>
          {/* Risk Score */}
          <AccordionItem value="risk-score" className="border-b">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-medium">Risk Score</span>
              </div>
              <div className="flex items-center gap-2">
                {riskScoreFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-blue-600 h-6 px-2 py-0 text-xs"
                    onClick={() => setRiskScoreFilters([])}
                  >
                    Clear
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-1 mb-3">
              {riskScoreFilters.map((filter) => (
                <Badge key={filter} className="bg-red-100 text-red-800 rounded-md px-2 py-1 flex items-center gap-1">
                  {filter}
                  <button className="text-red-500 hover:text-red-700" onClick={() => removeRiskFilter(filter)}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="pb-2">
              <div className="space-y-1">
                {["Low (0-39)", "Medium (40-69)", "High (70-84)", "Critical (85+)"].map((score) => (
                  <div key={score} className="flex items-center">
                    <div className="w-5 flex-shrink-0">
                      <input
                        type="checkbox"
                        id={`risk-${score}`}
                        className="mr-2"
                        checked={riskScoreFilters.includes(score)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRiskScoreFilters([...riskScoreFilters, score])
                          } else {
                            removeRiskFilter(score)
                          }
                        }}
                      />
                    </div>
                    <label htmlFor={`risk-${score}`} className="text-sm">
                      {score}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </AccordionItem>

          {/* Firm Size */}
          <AccordionItem value="firm-size" className="border-b">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" fill="currentColor" />
                </svg>
                <span className="font-medium">Firm Size</span>
              </div>
              <div className="flex items-center gap-2">
                {firmSizeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-blue-600 h-6 px-2 py-0 text-xs"
                    onClick={() => setFirmSizeFilters([])}
                  >
                    Clear
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-1 mb-3">
              {firmSizeFilters.map((filter) => (
                <Badge key={filter} className="bg-blue-100 text-blue-800 rounded-md px-2 py-1 flex items-center gap-1">
                  {filter}
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => removeFirmSizeFilter(filter)}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="pb-2">
              <div className="space-y-1">
                {["Solo", "Small", "Medium", "Large", "BigLaw"].map((size) => (
                  <div key={size} className="flex items-center">
                    <div className="w-5 flex-shrink-0">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        className="mr-2"
                        checked={firmSizeFilters.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFirmSizeFilters([...firmSizeFilters, size])
                          } else {
                            removeFirmSizeFilter(size)
                          }
                        }}
                      />
                    </div>
                    <label htmlFor={`size-${size}`} className="text-sm">
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </AccordionItem>

          {/* Practice Areas */}
          <AccordionItem value="practice-areas" className="border-b">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" fill="currentColor" />
                </svg>
                <span className="font-medium">Practice Areas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2 space-y-2">
                <div className="flex items-center">
                  <Input placeholder="Search practice areas" className="text-sm" />
                </div>
                <div className="space-y-1">
                  {[
                    "Mass Tort",
                    "Personal Injury",
                    "Class Action",
                    "Product Liability",
                    "Medical Malpractice",
                    "Environmental Law",
                  ].map((area) => (
                    <div key={area} className="flex items-center">
                      <div className="w-5 flex-shrink-0">
                        <input
                          type="checkbox"
                          id={`area-${area}`}
                          className="mr-2"
                          onChange={() => togglePracticeAreaFilter(area)}
                          checked={practiceAreaFilters.includes(area)}
                        />
                      </div>
                      <label htmlFor={`area-${area}`} className="text-sm">
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Geographic Location */}
          <AccordionItem value="location" className="border-b">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-medium">Location</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2 space-y-2">
                <div className="space-y-1">
                  {["New York", "California", "Florida", "Texas", "Illinois", "Pennsylvania"].map((state) => (
                    <div key={state} className="flex items-center">
                      <div className="w-5 flex-shrink-0">
                        <input
                          type="checkbox"
                          id={`state-${state}`}
                          className="mr-2"
                          onChange={() => toggleLocationFilter(state)}
                          checked={locationFilters.includes(state)}
                        />
                      </div>
                      <label htmlFor={`state-${state}`} className="text-sm">
                        {state}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Activity Level */}
          <AccordionItem value="activity" className="border-b">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 2.05V5.08C16.39 5.57 19 8.47 19 12C19 12.9 18.82 13.75 18.5 14.54L21.12 16.07C21.68 14.83 22 13.45 22 12C22 6.82 18.05 2.55 13 2.05ZM12 19C7.59 19 4 15.41 4 11C4 6.59 7.59 3 12 3C13.17 3 14.26 3.31 15.21 3.81L17.75 1.27C16.1 0.48 14.11 0 12 0C5.37 0 0 5.37 0 12S5.37 24 12 24C18.63 24 24 18.63 24 12H21C21 15.31 18.31 18 15 18H12V19Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-medium">Activity Level</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2 space-y-2">
                <div className="space-y-1">
                  {[
                    "High Activity (15+ campaigns)",
                    "Medium Activity (5-14 campaigns)",
                    "Low Activity (1-4 campaigns)",
                    "No Recent Activity",
                  ].map((activity) => (
                    <div key={activity} className="flex items-center">
                      <div className="w-5 flex-shrink-0">
                        <input
                          type="checkbox"
                          id={`activity-${activity}`}
                          className="mr-2"
                          onChange={() => toggleActivityFilter(activity)}
                          checked={activityFilters.includes(activity)}
                        />
                      </div>
                      <label htmlFor={`activity-${activity}`} className="text-sm">
                        {activity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Monitored Entities */}
          <AccordionItem value="entities" className="border-b">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-teal-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" fill="currentColor" />
                </svg>
                <span className="font-medium">Targeting Entities</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2 space-y-2">
                <div className="flex items-center">
                  <Input placeholder="Search entities" className="text-sm" />
                </div>
                <div className="space-y-1">
                  {["Zantac", "Roundup", "Juul E-Cigarette", "Ford Explorer", "Medical Devices", "Pharmaceuticals"].map(
                    (entity) => (
                      <div key={entity} className="flex items-center">
                        <div className="w-5 flex-shrink-0">
                          <input
                            type="checkbox"
                            id={`entity-${entity}`}
                            className="mr-2"
                            onChange={() => toggleEntityFilter(entity)}
                            checked={entityFilters.includes(entity)}
                          />
                        </div>
                        <label htmlFor={`entity-${entity}`} className="text-sm">
                          {entity}
                        </label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Ad Platforms */}
          <AccordionItem value="ad-platforms" className="border-b">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" fill="currentColor" />
                </svg>
                <span className="font-medium">Ad Platforms</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2 space-y-2">
                <div className="space-y-1">
                  {["Facebook", "Youtube", "Tiktok", "Instagram", "Reddit"].map((platform) => (
                    <div key={platform} className="flex items-center">
                      <div className="w-5 flex-shrink-0">
                        <input
                          type="checkbox"
                          id={`platform-${platform}`}
                          className="mr-2"
                          checked={adPlatformFilters.includes(platform)}
                          onChange={() => toggleAdPlatformFilter(platform)}
                        />
                      </div>
                      <label htmlFor={`platform-${platform}`} className="text-sm">
                        {platform}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
