"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { LogIn } from "lucide-react"

interface LoginFormProps {
  onLogin: (username: string) => void
}

// Meritronics logo URL from Vercel Blob
const LOGO_URL =
  "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    // In a real app, you would validate credentials against a backend
    // For this demo, we'll accept any non-empty username/password
    onLogin(username)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 compact-layout red-theme friendly-ui">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 card-friendly">
          <div className="flex justify-center mb-4">
            <Image
              src={LOGO_URL || "/placeholder.svg"}
              alt="Meritronics Logo"
              width={180}
              height={50}
              className="h-auto"
              priority
            />
          </div>

          <h2 className="text-lg font-bold text-center text-[hsl(var(--primary))] mb-4">Manufacturing Process</h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-md mb-3 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="username" className="text-sm">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-8 text-sm input-friendly"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-8 text-sm input-friendly"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white btn-friendly flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Demo credentials: any username/password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
