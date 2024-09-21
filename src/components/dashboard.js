"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu } from "lucide-react"
import Sidebar from './sidebar'

export default function Dashboard() {
  const { setTheme, theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-secondary text-secondary-foreground">
          <Button variant="outline" size="icon" onClick={toggleSidebar}>
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="sr-only">Switch to Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="sr-only">Switch to Dark Theme</span>
              </>
            )}
          </Button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold mb-4 text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your dashboard. This is where you can add your main content.</p>
          </div>
        </main>
      </div>
    </div>
  )
}