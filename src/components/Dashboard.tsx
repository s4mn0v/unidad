'use client'

import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Settings } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Dashboard() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const pages = [
        { name: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" />, path: '/' },
        { name: 'Documents', icon: <FileText className="mr-2 h-4 w-4" />, path: '/documents' },
        { name: 'Settings', icon: <Settings className="mr-2 h-4 w-4" />, path: '/settings' },
    ]

    const activePage = pages.find(page => page.path === location.pathname)?.name || 'Dashboard'

    const setActivePage = (pageName: string) => {
        const page = pages.find(p => p.name === pageName)
        if (page) {
            navigate(page.path)
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                pages={pages}
                activePage={activePage}
                setActivePage={setActivePage}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    activePage={activePage}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}