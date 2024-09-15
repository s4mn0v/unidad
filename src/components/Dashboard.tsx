'use client'

import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Settings, FileChartColumnIncreasing } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useTheme } from './ThemeProvider'

export default function Dashboard() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const { theme } = useTheme()

    const pages = [
        { name: 'Dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" />, path: '/home' },
        { name: 'Documents', icon: <FileText className="mr-2 h-4 w-4" />, path: '/documents' },
        { name: 'Settings', icon: <Settings className="mr-2 h-4 w-4" />, path: '/settings' },
        { name: 'Registros', icon: <FileChartColumnIncreasing className="mr-2 h-4 w-4"/>, path: '/records'}
    ]

    const activePage = pages.find(page => page.path === location.pathname)?.name || 'Dashboard'

    const setActivePage = (pageName: string) => {
        const page = pages.find(p => p.name === pageName)
        if (page) {
            navigate(page.path)
        }
    }

    return (
        <div className={`flex w-screen h-screen ${theme === 'dark' ? 'bg-dark-background text-dark-foreground' : 'bg-light-background text-light-foreground'}`}>
            <Sidebar
                pages={pages}
                activePage={activePage}
                setActivePage={setActivePage}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64 flex-1' : 'flex-1 w-full'}`}>
                <Header
                    activePage={activePage}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isSidebarOpen={isSidebarOpen}
                />

                <main className={`flex-1 overflow-x-hidden overflow-y-auto p-4 ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}