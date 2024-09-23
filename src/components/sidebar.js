'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ReplaceAll, Table2, ChevronDown, BookOpenCheck, FileText } from 'lucide-react'
import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useState, useEffect } from 'react'

export default function Sidebar({ isOpen }) {
  const pathname = usePathname()
  const [isStoreOpen, setIsStoreOpen] = useState(false)
  const [isFormsOpen, setIsFormsOpen] = useState(false)

  useEffect(() => {
    const storedStoreOpen = localStorage.getItem('isStoreOpen')
    const storedFormsOpen = localStorage.getItem('isFormsOpen')
    
    if (storedStoreOpen !== null) {
      setIsStoreOpen(JSON.parse(storedStoreOpen))
    }
    if (storedFormsOpen !== null) {
      setIsFormsOpen(JSON.parse(storedFormsOpen))
    }
  }, [])

  const handleStoreOpenChange = (open) => {
    setIsStoreOpen(open)
    localStorage.setItem('isStoreOpen', JSON.stringify(open))
  }

  const handleFormsOpenChange = (open) => {
    setIsFormsOpen(open)
    localStorage.setItem('isFormsOpen', JSON.stringify(open))
  }

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/convert', label: 'Convert', icon: ReplaceAll },
    { href: '/registrations', label: 'Inscripciones', icon: BookOpenCheck},
  ]

  const formLinks = [
    { href: '/forms/students', label: 'Estudiantes' },
    { href: '/forms/programs', label: 'Programas' },
    { href: '/forms/agents', label: 'Agentes' }
  ]

  const recordsLinks = [
    { href: '/records/students', label: 'General' },
    { href: '/records/active_students', label: 'Estudiantes Activos' },
    { href: '/records/moodle_students', label: 'Estudiantes Moodle' },
    { href: '/records/graduates_students', label: 'Egresados'},
    { href: '/records/registrations', label: 'Inscripciones'}
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
                  'flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground',
                  pathname === href && 'bg-accent text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className={cn(`${isOpen ? 'md:inline' : 'md:hidden'}`)}>
                  {label}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Collapsible
              open={isFormsOpen}
              onOpenChange={handleFormsOpenChange}
              className="w-full"
            >
              <CollapsibleTrigger className={cn(
                'flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground',
                isFormsOpen && 'bg-accent text-accent-foreground'
              )}>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span className={cn(`${isOpen ? 'md:inline' : 'md:hidden'}`)}>
                    Formularios
                  </span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isFormsOpen ? 'transform rotate-180' : ''
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 mt-2 space-y-2">
                {formLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground',
                      pathname === href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <span className={cn(`${isOpen ? 'md:inline' : 'md:hidden'}`)}>
                      {label}
                    </span>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </li>
          <li>
            <Collapsible
              open={isStoreOpen}
              onOpenChange={handleStoreOpenChange}
              className="w-full"
            >
              <CollapsibleTrigger className={cn(
                'flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground',
                isStoreOpen && 'bg-accent text-accent-foreground'
              )}>
                <div className="flex items-center space-x-2">
                  <Table2 className="h-5 w-5" />
                  <span className={cn(`${isOpen ? 'md:inline' : 'md:hidden'}`)}>
                    Registros
                  </span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isStoreOpen ? 'transform rotate-180' : ''
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 mt-2 space-y-2">
                {recordsLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground',
                      pathname === href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <span className={cn(`${isOpen ? 'md:inline' : 'md:hidden'}`)}>
                      {label}
                    </span>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </li>
        </ul>
      </nav>
    </div>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
}