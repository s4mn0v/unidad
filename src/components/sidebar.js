"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, Users } from 'lucide-react'
import PropTypes from 'prop-types'
import { cn } from "@/lib/utils"

export default function Sidebar({ isOpen }) {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className={cn(`
      bg-secondary text-secondary-foreground
      w-64 space-y-6 py-7 px-2
      absolute inset-y-0 left-0 transform
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
      transition duration-200 ease-in-out
      ${isOpen ? 'md:w-64' : 'md:w-16'}
      overflow-hidden
    `)}>
      <nav>
        <ul className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link 
                href={href} 
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground",
                  pathname === href && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className={cn(`${isOpen ? 'md:inline' : 'md:hidden'}`)}>
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
}