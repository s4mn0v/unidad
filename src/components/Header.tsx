import React from 'react'
import { Button } from "@/components/ui/button"
import { Menu, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface HeaderProps {
  activePage: string
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSidebarOpen: boolean
}

const Header: React.FC<HeaderProps> = ({ activePage, setIsSidebarOpen, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={`${theme === 'dark' ? 'bg-dark-background border-gray-700' : 'bg-light-background border-gray-200'} border-b p-4 flex justify-between items-center`}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="flex-none items-center p-0 m-0 bg-transparent border-0 mr-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          <span className="sr-only">{isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
        </Button>

        <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-dark-foreground' : 'text-light-foreground'}`}>{activePage}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button className="flex-none items-center p-0 m-0 bg-transparent border-0" variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(prev => !prev)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}

export default Header