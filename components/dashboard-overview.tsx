"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import { AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin, Users, Calendar } from "lucide-react"

const problemsOverTime = [
  { month: "Jan", reported: 45, resolved: 38 },
  { month: "Feb", reported: 52, resolved: 41 },
  { month: "Mar", reported: 48, resolved: 45 },
  { month: "Apr", reported: 61, resolved: 52 },
  { month: "May", reported: 55, resolved: 48 },
  { month: "Jun", reported: 67, resolved: 58 },
]

const problemsByType = [
  { name: "Potholes", value: 89, color: "hsl(var(--chart-1))" },
  { name: "Streetlights", value: 67, color: "hsl(var(--chart-2))" },
  { name: "Garbage", value: 45, color: "hsl(var(--chart-3))" },
  { name: "Water Issues", value: 32, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 14, color: "hsl(var(--chart-5))" },
]

const recentProblems = [
  {
    id: 1,
    title: "Large pothole on Main Street",
    location: "University Main Gate Road",
    status: "pending",
    upvotes: 23,
    reportedAt: "2 hours ago",
    priority: "high",
  },
  {
    id: 2,
    title: "Broken streetlight",
    location: "Academic Block Parking",
    status: "in-progress",
    upvotes: 15,
    reportedAt: "4 hours ago",
    priority: "medium",
  },
  {
    id: 3,
    title: "Overflowing garbage bin",
    location: "Hostel Block C Area",
    status: "resolved",
    upvotes: 8,
    reportedAt: "1 day ago",
    priority: "low",
  },
  {
    id: 4,
    title: "Water leak on residential street",
    location: "Dehmi-Kalan Village Road",
    status: "pending",
    upvotes: 19,
    reportedAt: "3 hours ago",
    priority: "high",
  },
]

export function DashboardOverview() {
  const { t } = useLanguage()
  const totalProblems = 247
  const resolvedProblems = 189
  const pendingProblems = 58
  const resolutionRate = Math.round((resolvedProblems / totalProblems) * 100)
  const mostUpvotedProblem = recentProblems.reduce((prev, current) => (prev.upvotes > current.upvotes ? prev : current))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">{t("dashboard.overview")}</h1>
        <p className="text-muted-foreground mt-2">{t("dashboard.overviewDescription")}</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.totalProblems")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProblems}</div>
            <p className="text-xs text-chart-2 mt-1">+12% {t("dashboard.fromLastMonth")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.resolved")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedProblems}</div>
            <p className="text-xs text-chart-2 mt-1">+8% {t("dashboard.fromLastMonth")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.pending")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingProblems}</div>
            <p className="text-xs text-chart-4 mt-1">-3% {t("dashboard.fromLastMonth")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.resolutionRate")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolutionRate}%</div>
            <Progress value={resolutionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Problems Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.problemsOverTime")}</CardTitle>
            <CardDescription>{t("dashboard.monthlyReported")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={problemsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reported" fill="hsl(var(--chart-1))" name={t("dashboard.reported")} />
                <Bar dataKey="resolved" fill="hsl(var(--chart-2))" name={t("dashboard.resolved")} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-2 pt-2 border-t border-border">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("dashboard.recentProblems")}</h4>
              <div className="space-y-1">
                {recentProblems.slice(0, 2).map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between p-1.5 bg-muted/30 rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{problem.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {problem.location} • {problem.reportedAt}
                      </p>
                    </div>
                    <Badge
                      variant={
                        problem.status === "resolved"
                          ? "default"
                          : problem.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {t(`status.${problem.status.replace("-", "")}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problems by Type Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.problemsByType")}</CardTitle>
            <CardDescription>{t("dashboard.typeDistribution")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={problemsByType}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {problemsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-2 pt-2 border-t border-border">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("dashboard.topProblemTypes")}</h4>
              <div className="space-y-1">
                {problemsByType.slice(0, 2).map((type, index) => (
                  <div key={type.name} className="flex items-center justify-between p-1.5 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="text-sm font-medium">
                        {t(`problemType.${type.name.toLowerCase().replace(" ", "")}`)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{type.value}</div>
                      <div className="text-xs text-muted-foreground">{t("dashboard.reports")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Upvoted Problem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("dashboard.mostUpvoted")}
          </CardTitle>
          <CardDescription>{t("dashboard.highestPriority")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{mostUpvotedProblem.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {mostUpvotedProblem.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {mostUpvotedProblem.reportedAt}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={mostUpvotedProblem.priority === "high" ? "destructive" : "secondary"}
                className="capitalize"
              >
                {t(`priority.${mostUpvotedProblem.priority}`)} {t("priority.priority")}
              </Badge>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mostUpvotedProblem.upvotes}</div>
                <div className="text-xs text-muted-foreground">{t("dashboard.votes")}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
          <CardDescription>{t("dashboard.latestReports")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProblems.map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{problem.title}</h4>
                    <Badge
                      variant={
                        problem.status === "resolved"
                          ? "default"
                          : problem.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                      className={problem.status === "resolved" ? "bg-chart-2 text-white" : ""}
                    >
                      {t(`status.${problem.status.replace("-", "")}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {problem.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {problem.reportedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {problem.upvotes} {t("dashboard.votes")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
