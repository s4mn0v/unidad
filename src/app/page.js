'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, GraduationCap, School } from 'lucide-react'
import { getStudents, getPrograms } from '@/utils/api'

export default function Home() {
  const [studentCount, setStudentCount] = useState(0)
  const [programCount, setProgramCount] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const students = await getStudents()
        const programs = await getPrograms()
        setStudentCount(students.length)
        setProgramCount(programs.length)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <Dashboard>
      <h1 className="text-3xl font-semibold mb-6 text-foreground">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount}</div>
            <p className="text-xs text-muted-foreground">Estudiantes registrados</p>
          </CardContent>
        </Card>
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programCount}</div>
            <p className="text-xs text-muted-foreground">Programas académicos</p>
          </CardContent>
        </Card>
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Estudiantes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programCount > 0 ? (studentCount / programCount).toFixed(2) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Estudiantes por programa</p>
          </CardContent>
        </Card>
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facultades</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Información no disponible</p>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  )
}