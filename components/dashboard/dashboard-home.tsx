"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, Settings, TrendingUp, Users } from "lucide-react"

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">--</div>
            <p className="text-xs text-muted-foreground">Active manufacturing stations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active MPIs</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">--</div>
            <p className="text-xs text-muted-foreground">Process instructions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">--%</div>
            <p className="text-xs text-muted-foreground">Overall equipment effectiveness</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">--</div>
            <p className="text-xs text-muted-foreground">Active operators</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[hsl(var(--primary))]">Manufacturing Process Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Welcome to the Meritronics Manufacturing Process Management System. Use the sidebar to navigate between
            different sections:
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              • <strong>Stations:</strong> View and manage manufacturing stations
            </li>
            <li>
              • <strong>Create Station:</strong> Add new manufacturing stations
            </li>
            <li>
              • <strong>MPI:</strong> Manage Manufacturing Process Instructions
            </li>
            <li>
              • <strong>Create MPI:</strong> Add new process instructions
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
