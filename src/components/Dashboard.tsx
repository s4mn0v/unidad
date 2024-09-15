'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, FileText, Settings } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header.tsx'

export default function Dashboard() {
    const [activePage, setActivePage] = useState('Dashboard')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const pages = [
        { name: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
        { name: 'Documents', icon: <FileText className="mr-2 h-4 w-4" /> },
        { name: 'Settings', icon: <Settings className="mr-2 h-4 w-4" /> },
    ]

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                pages={pages}
                activePage={activePage}
                setActivePage={setActivePage}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <Header
                    activePage={activePage}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Page content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{activePage}</CardTitle>
                            <CardDescription>This is the {activePage.toLowerCase()} page content.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Welcome to the {activePage} page. Here you can find all the relevant information and actions related to {activePage.toLowerCase()}.</p>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
