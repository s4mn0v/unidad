import { Button } from "@/components/ui/button"

interface SidebarProps {
  pages: { name: string; icon: JSX.Element }[]
  activePage: string
  setActivePage: (page: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ pages, activePage, setActivePage, isSidebarOpen, setIsSidebarOpen }) => (
  <>
    {/* Sidebar for larger screens */}
    <aside className={`bg-white w-64 p-6 hidden md:block`}>
      <nav className="space-y-2">
        {pages.map((page) => (
          <Button
            key={page.name}
            variant={activePage === page.name ? "default" : "ghost"}
            className="w-full justify-start"
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
        <aside className="bg-white w-64 h-full p-6">
          <nav className="space-y-2">
            {pages.map((page) => (
              <Button
                key={page.name}
                variant={activePage === page.name ? "default" : "ghost"}
                className="w-full justify-start"
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

export default Sidebar
