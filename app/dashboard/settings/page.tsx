"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Wrench } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()

  const settingsOptions = [
    {
      id: "services",
      title: "Services",
      description: "Manage system services and configurations",
      icon: Wrench,
      path: "/dashboard/settings/services",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card key={option.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </div>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push(option.path)} className="w-full">
                  Manage {option.title}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
