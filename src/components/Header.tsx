import React from 'react'
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'

interface HeaderProps {
  activePage: string
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<HeaderProps> = ({ activePage, setIsSidebarOpen }) => (
  <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
    <h1 className="text-xl font-semibold">{activePage}</h1>
    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(prev => !prev)}>
      <Menu className="h-6 w-6" />
    </Button>
  </header>
)

export default Header