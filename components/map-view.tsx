"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Lightbulb,
  Trash2,
  Droplets,
  MoreHorizontal,
} from "lucide-react"

// Mock data - same as in problem-management.tsx
interface Problem {
  id: string
  title: string
  description: string
  location: string
  coordinates: { lat: number; lng: number }
  type: "pothole" | "streetlight" | "garbage" | "water" | "other"
  status: "pending" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  upvotes: number
  reportedAt: string
  resolvedAt?: string
  citizenComments: Array<{
    id: string
    author: string
    comment: string
    timestamp: string
  }>
  photos: string[]
  reportedBy: string
}

const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Large pothole near University Gate",
    description: "Deep pothole causing damage to vehicles. Located near the main university entrance gate.",
    location: "Manipal University Main Gate",
    coordinates: { lat: 26.843, lng: 75.5681 }, // Updated to Manipal University Jaipur coordinates
    type: "pothole",
    status: "pending",
    priority: "high",
    upvotes: 23,
    reportedAt: "2024-01-15T10:30:00Z",
    citizenComments: [
      { id: "1", author: "Ramesh S.", comment: "This is getting worse every day!", timestamp: "2024-01-15T11:00:00Z" },
      { id: "2", author: "Priya M.", comment: "My scooter tire was damaged here", timestamp: "2024-01-15T14:30:00Z" },
    ],
    photos: ["/street-pothole.png"],
    reportedBy: "citizen@email.com",
  },
  {
    id: "2",
    title: "Broken streetlight near Hostel Block",
    description: "Streetlight has been out for over a week, creating safety concerns for students walking at night.",
    location: "University Hostel Block A", // Updated to university-specific location
    coordinates: { lat: 26.844, lng: 75.569 }, // Updated coordinates near university
    type: "streetlight",
    status: "in-progress",
    priority: "medium",
    upvotes: 15,
    reportedAt: "2024-01-14T18:45:00Z",
    citizenComments: [
      {
        id: "3",
        author: "Suresh K.",
        comment: "Very dark at night, students feel unsafe",
        timestamp: "2024-01-14T19:00:00Z",
      },
    ],
    photos: ["/broken-streetlight.jpg"],
    reportedBy: "resident@email.com",
  },
  {
    id: "3",
    title: "Overflowing garbage bin near Cafeteria",
    description: "Public garbage bin is overflowing near the university cafeteria and attracting stray animals.",
    location: "University Cafeteria Area", // Updated to university cafeteria
    coordinates: { lat: 26.8425, lng: 75.5675 }, // Updated coordinates
    type: "garbage",
    status: "resolved",
    priority: "low",
    upvotes: 8,
    reportedAt: "2024-01-13T09:15:00Z",
    resolvedAt: "2024-01-14T16:30:00Z",
    citizenComments: [],
    photos: ["/overflowing-garbage-bin.png"],
    reportedBy: "walker@email.com",
  },
  {
    id: "4",
    title: "Water leak near Academic Block",
    description: "Water main leak causing flooding on the road near the main academic building.",
    location: "Academic Block - Main Building", // Updated to academic block
    coordinates: { lat: 26.8435, lng: 75.5685 }, // Updated coordinates
    type: "water",
    status: "pending",
    priority: "high",
    upvotes: 19,
    reportedAt: "2024-01-15T07:20:00Z",
    citizenComments: [
      {
        id: "4",
        author: "Kavita J.",
        comment: "Water is affecting classes, please fix soon",
        timestamp: "2024-01-15T08:00:00Z",
      },
    ],
    photos: ["/water-leak-on-street.jpg"],
    reportedBy: "neighbor@email.com",
  },
  {
    id: "5",
    title: "Damaged road surface near Library",
    description: "Cracked road surface creating difficulty for vehicles and students walking to the library.",
    location: "University Library Road", // Updated to library area
    coordinates: { lat: 26.842, lng: 75.567 }, // Updated coordinates
    type: "other",
    status: "pending",
    priority: "medium",
    upvotes: 12,
    reportedAt: "2024-01-14T14:20:00Z",
    citizenComments: [],
    photos: [],
    reportedBy: "pedestrian@email.com",
  },
  {
    id: "6",
    title: "Flickering streetlight near Sports Complex",
    description: "Streetlight intermittently turns on and off near the university sports complex.",
    location: "University Sports Complex", // Updated to sports complex
    coordinates: { lat: 26.8445, lng: 75.5695 }, // Updated coordinates
    type: "streetlight",
    status: "in-progress",
    priority: "low",
    upvotes: 6,
    reportedAt: "2024-01-13T20:15:00Z",
    citizenComments: [],
    photos: [],
    reportedBy: "resident2@email.com",
  },
]

const problemTypeIcons = {
  pothole: AlertTriangle,
  streetlight: Lightbulb,
  garbage: Trash2,
  water: Droplets,
  other: MoreHorizontal,
}

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [problems] = useState<Problem[]>(mockProblems)
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>(mockProblems)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Filter problems based on selected filters
  useEffect(() => {
    const filtered = problems.filter((problem) => {
      const matchesStatus = statusFilter === "all" || problem.status === statusFilter
      const matchesType = typeFilter === "all" || problem.type === typeFilter
      return matchesStatus && matchesType
    })
    setFilteredProblems(filtered)
  }, [problems, statusFilter, typeFilter])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const timer = setTimeout(async () => {
      try {
        // Dynamically import Leaflet to avoid SSR issues
        const L = (await import("leaflet")).default

        // Fix for default markers in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        if (!mapRef.current) return

        // Initialize map centered on Manipal University Jaipur
        const map = L.map(mapRef.current).setView([26.843, 75.5681], 14)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        mapInstanceRef.current = map
        setMapLoaded(true)
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        setMapLoaded(false)
      }
    }
  }, []) // Removed mapLoaded dependency to prevent re-initialization

  // Update markers when filtered problems change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      // Add new markers
      filteredProblems.forEach((problem) => {
        const getMarkerColor = (status: string, priority: string) => {
          if (status === "resolved") return "#10b981" // green
          if (status === "in-progress") return "#f59e0b" // yellow
          if (priority === "high") return "#ef4444" // red
          if (priority === "medium") return "#f97316" // orange
          return "#6b7280" // gray
        }

        const color = getMarkerColor(problem.status, problem.priority)

        // Create custom icon
        const customIcon = L.divIcon({
          html: `
            <div style="
              background-color: ${color};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background-color: white;
                border-radius: 50%;
              "></div>
            </div>
          `,
          className: "custom-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const marker = L.marker([problem.coordinates.lat, problem.coordinates.lng], {
          icon: customIcon,
        }).addTo(mapInstanceRef.current)

        // Add click event to marker
        marker.on("click", () => {
          setSelectedProblem(problem)
          setIsDialogOpen(true)
        })

        // Add popup with basic info
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${problem.title}</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${problem.location}</p>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <span style="
                background: ${problem.status === "resolved" ? "#10b981" : problem.status === "in-progress" ? "#f59e0b" : "#ef4444"};
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                text-transform: capitalize;
              ">${problem.status.replace("-", " ")}</span>
              <span style="
                background: #f3f4f6;
                color: #374151;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                text-transform: capitalize;
              ">${problem.type}</span>
            </div>
            <p style="margin: 0; color: #666; font-size: 12px;">👍 ${problem.upvotes} votes</p>
          </div>
        `)

        markersRef.current.push(marker)
      })
    }

    updateMarkers()
  }, [filteredProblems, mapLoaded])

  const getStatusBadge = (status: Problem["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="secondary">
            <AlertTriangle className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-chart-2 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
    }
  }

  const getPriorityBadge = (priority: Problem["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>
      case "low":
        return <Badge variant="outline">Low Priority</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Interactive Map</h1>
        <p className="text-muted-foreground mt-2">
          View all reported problems on the map. Click on markers to see details.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Map Filters
          </CardTitle>
          <CardDescription>Filter problems shown on the map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pothole">Potholes</SelectItem>
                  <SelectItem value="streetlight">Streetlights</SelectItem>
                  <SelectItem value="garbage">Garbage</SelectItem>
                  <SelectItem value="water">Water Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all")
                  setTypeFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-white shadow"></div>
              <span>Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
              <span>Resolved</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle>Problems Map ({filteredProblems.length} problems shown)</CardTitle>
          <CardDescription>Click on any marker to view problem details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div ref={mapRef} className="w-full h-[600px] rounded-lg border" style={{ minHeight: "600px" }} />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Problem Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedProblem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedProblem.title}
                </DialogTitle>
                <DialogDescription>{selectedProblem.location}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status and Priority */}
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(selectedProblem.status)}
                  {getPriorityBadge(selectedProblem.priority)}
                  <Badge variant="outline" className="capitalize">
                    {selectedProblem.type}
                  </Badge>
                </div>

                {/* Problem Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{selectedProblem.upvotes} votes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Reported {new Date(selectedProblem.reportedAt).toLocaleDateString()}</span>
                      </div>
                      {selectedProblem.resolvedAt && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Resolved {new Date(selectedProblem.resolvedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedProblem.location}</span>
                      </div>
                      <div className="text-muted-foreground mt-1">
                        Coordinates: {selectedProblem.coordinates.lat.toFixed(4)},{" "}
                        {selectedProblem.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedProblem.description}</p>
                </div>

                {/* Photos */}
                {selectedProblem.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProblem.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt={`Problem photo ${index + 1}`}
                          className="rounded-lg border w-full h-48 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                {selectedProblem.citizenComments.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Citizen Comments ({selectedProblem.citizenComments.length})</h3>
                    <div className="space-y-3">
                      {selectedProblem.citizenComments.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
    </div>
  )
}
