"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Calendar,
  Users,
  ArrowUpDown,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Lightbulb,
  Droplets,
  MoreHorizontal,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

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

// Mock data
const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Large pothole on Main Street",
    description: "Deep pothole causing damage to vehicles. Located near the intersection with 5th Avenue.",
    location: "Main St & 5th Ave",
    coordinates: { lat: 40.7128, lng: -74.006 },
    type: "pothole",
    status: "pending",
    priority: "high",
    upvotes: 23,
    reportedAt: "2024-01-15T10:30:00Z",
    citizenComments: [
      { id: "1", author: "John D.", comment: "This is getting worse every day!", timestamp: "2024-01-15T11:00:00Z" },
      { id: "2", author: "Sarah M.", comment: "My car tire was damaged here", timestamp: "2024-01-15T14:30:00Z" },
    ],
    photos: ["/street-pothole.png"],
    reportedBy: "citizen@email.com",
  },
  {
    id: "2",
    title: "Broken streetlight",
    description: "Streetlight has been out for over a week, creating safety concerns for pedestrians.",
    location: "Oak Avenue near Park",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    type: "streetlight",
    status: "in-progress",
    priority: "medium",
    upvotes: 15,
    reportedAt: "2024-01-14T18:45:00Z",
    citizenComments: [
      {
        id: "3",
        author: "Mike R.",
        comment: "Very dark at night, needs urgent attention",
        timestamp: "2024-01-14T19:00:00Z",
      },
    ],
    photos: ["/broken-streetlight.jpg"],
    reportedBy: "resident@email.com",
  },
  {
    id: "3",
    title: "Overflowing garbage bin",
    description: "Public garbage bin is overflowing and attracting pests.",
    location: "Central Park District",
    coordinates: { lat: 40.7831, lng: -73.9712 },
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
    title: "Water leak on residential street",
    description: "Water main leak causing flooding on the sidewalk and road.",
    location: "Elm Street",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    type: "water",
    status: "pending",
    priority: "high",
    upvotes: 19,
    reportedAt: "2024-01-15T07:20:00Z",
    citizenComments: [
      {
        id: "4",
        author: "Lisa K.",
        comment: "Water is getting worse, please fix soon",
        timestamp: "2024-01-15T08:00:00Z",
      },
    ],
    photos: ["/water-leak-on-street.jpg"],
    reportedBy: "neighbor@email.com",
  },
]

const problemTypeIcons = {
  pothole: AlertTriangle,
  streetlight: Lightbulb,
  garbage: Trash2,
  water: Droplets,
  other: MoreHorizontal,
}

export function ProblemManagement() {
  const { user } = useAuth()
  const [problems, setProblems] = useState<Problem[]>(mockProblems)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "upvotes" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)

  const filteredAndSortedProblems = useMemo(() => {
    const filtered = problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || problem.status === statusFilter
      const matchesType = typeFilter === "all" || problem.type === typeFilter
      const matchesPriority = priorityFilter === "all" || problem.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
          break
        case "upvotes":
          comparison = a.upvotes - b.upvotes
          break
        case "status":
          const statusOrder = { pending: 0, "in-progress": 1, resolved: 2 }
          comparison = statusOrder[a.status] - statusOrder[b.status]
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [problems, searchTerm, statusFilter, typeFilter, priorityFilter, sortBy, sortOrder])

  const updateProblemStatus = (problemId: string, newStatus: Problem["status"]) => {
    setProblems((prev) =>
      prev.map((problem) =>
        problem.id === problemId
          ? {
              ...problem,
              status: newStatus,
              resolvedAt: newStatus === "resolved" ? new Date().toISOString() : undefined,
            }
          : problem,
      ),
    )
  }

  const handleSort = (field: "date" | "upvotes" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getStatusBadge = (status: Problem["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Pending
          </Badge>
        )
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-chart-2 text-white">Resolved</Badge>
    }
  }

  const getPriorityBadge = (priority: Problem["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Problem Management</h1>
        <p className="text-muted-foreground mt-2">View, filter, and manage all citizen-reported problems</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status-filter">Status</Label>
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
              <Label htmlFor="type-filter">Type</Label>
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

            <div>
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setTypeFilter("all")
                  setPriorityFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems Table */}
      <Card>
        <CardHeader>
          <CardTitle>Problems ({filteredAndSortedProblems.length})</CardTitle>
          <CardDescription>Click on any problem to view details and manage status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Problem</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("upvotes")}>
                    <div className="flex items-center gap-1">
                      Votes
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center gap-1">
                      Reported
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProblems.map((problem) => {
                  const IconComponent = problemTypeIcons[problem.type]
                  return (
                    <TableRow key={problem.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{problem.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">{problem.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {problem.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {problem.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(problem.status)}</TableCell>
                      <TableCell>{getPriorityBadge(problem.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {problem.upvotes}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(problem.reportedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProblem(problem)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{problem.title}</DialogTitle>
                              <DialogDescription>Problem details and management options</DialogDescription>
                            </DialogHeader>
                            <ProblemDetails
                              problem={problem}
                              onStatusUpdate={updateProblemStatus}
                              canUpdateStatus={user?.role === "municipal" || user?.role === "ngo"}
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProblemDetails({
  problem,
  onStatusUpdate,
  canUpdateStatus,
}: {
  problem: Problem
  onStatusUpdate: (id: string, status: Problem["status"]) => void
  canUpdateStatus: boolean
}) {
  const [newComment, setNewComment] = useState("")

  const handleStatusChange = (newStatus: Problem["status"]) => {
    onStatusUpdate(problem.id, newStatus)
  }

  return (
    <div className="space-y-6">
      {/* Problem Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Problem Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Location:</strong> {problem.location}
            </div>
            <div>
              <strong>Type:</strong>{" "}
              <Badge variant="outline" className="capitalize">
                {problem.type}
              </Badge>
            </div>
            <div>
              <strong>Priority:</strong>{" "}
              {problem.priority === "high" ? (
                <Badge variant="destructive">High</Badge>
              ) : problem.priority === "medium" ? (
                <Badge variant="secondary">Medium</Badge>
              ) : (
                <Badge variant="outline">Low</Badge>
              )}
            </div>
            <div>
              <strong>Reported:</strong> {new Date(problem.reportedAt).toLocaleString()}
            </div>
            {problem.resolvedAt && (
              <div>
                <strong>Resolved:</strong> {new Date(problem.resolvedAt).toLocaleString()}
              </div>
            )}
            <div>
              <strong>Upvotes:</strong> {problem.upvotes}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Status Management</h3>
          <div className="space-y-3">
            <div>
              Current Status:{" "}
              {problem.status === "pending" ? (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Pending
                </Badge>
              ) : problem.status === "in-progress" ? (
                <Badge variant="secondary">In Progress</Badge>
              ) : (
                <Badge className="bg-chart-2 text-white">Resolved</Badge>
              )}
            </div>

            {canUpdateStatus && (
              <div className="flex gap-2">
                {problem.status === "pending" && (
                  <Button size="sm" onClick={() => handleStatusChange("in-progress")}>
                    <Clock className="h-4 w-4 mr-1" />
                    Start Work
                  </Button>
                )}
                {problem.status === "in-progress" && (
                  <Button size="sm" onClick={() => handleStatusChange("resolved")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Resolved
                  </Button>
                )}
                {problem.status === "resolved" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange("pending")}>
                    Reopen
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-sm text-muted-foreground">{problem.description}</p>
      </div>

      {/* Photos */}
      {problem.photos.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Photos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problem.photos.map((photo, index) => (
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
      <div>
        <h3 className="font-semibold mb-2">Citizen Comments ({problem.citizenComments.length})</h3>
        <div className="space-y-3">
          {problem.citizenComments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm">{comment.comment}</p>
            </div>
          ))}

          {problem.citizenComments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
        </div>
      </div>
    </div>
  )
}
