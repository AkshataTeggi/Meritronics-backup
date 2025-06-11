"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  const handleLogin = (user: string) => {
    setUsername(user)
    setIsLoggedIn(true)
    // Redirect to dashboard after login
    window.location.href = "/dashboard"
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
  }

  return <LoginForm onLogin={handleLogin} />
}
