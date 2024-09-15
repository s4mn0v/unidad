import React from 'react'
import { Button } from "@/components/ui/button"
import { useTheme } from './ThemeProvider'

interface SidebarProps {
  pages: { name: string; icon: JSX.Element }[]
  activePage: string
  setActivePage: (page: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ pages, activePage, setActivePage, isSidebarOpen, setIsSidebarOpen }) => {
  const { theme } = useTheme()

  return (
    <>
      {/* Sidebar for larger screens */}
      <aside className={`${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'} w-64 p-6 hidden md:block transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-full z-20`}>
        <nav className="space-y-2">
          {pages.map((page) => (
            <Button
              key={page.name}
              variant="ghost"
              className={`w-full justify-start ${
                theme === 'dark' 
                  ? 'text-dark-foreground hover:bg-neutral-700' 
                  : 'text-light-foreground hover:bg-neutral-200'
              } ${
                activePage === page.name
                  ? `border-2 ${theme === 'dark' ? 'border-white' : 'border-black'}`
                  : ''
              } ${
                theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200'
              }`}
              onClick={() => setActivePage(page.name)}
            >
              {page.icon}
              {page.name}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <aside className={`${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'} w-64 h-full p-6`}>
            <nav className="space-y-2">
              {pages.map((page) => (
                <Button
                  key={page.name}
                  variant="ghost"
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'text-dark-foreground hover:bg-neutral-700' 
                      : 'text-light-foreground hover:bg-neutral-200'
                  } ${
                    activePage === page.name
                      ? `border-2 ${theme === 'dark' ? 'border-white' : 'border-black'}`
                      : ''
                  } ${
                    theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200'
                  }`}
                  onClick={() => {
                    setActivePage(page.name)
                    setIsSidebarOpen(false)
                  }}
                >
                  {page.icon}
                  {page.name}
                </Button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar