'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, GraduationCap, School, UserCheck, Briefcase, TrendingUp, Award } from 'lucide-react'
import { getStudents, getPrograms, getAgents, getInscriptions } from '@/utils/api'

export default function Home() {
  const [studentCount, setStudentCount] = useState(0)
  const [programCount, setProgramCount] = useState(0)
  const [agentCount, setAgentCount] = useState(0)
  const [inscriptionCount, setInscriptionCount] = useState(0)
  const [topProgram, setTopProgram] = useState({ name: '', count: 0 })
  const [activeStudentCount, setActiveStudentCount] = useState(0)
  const [averageInscriptionsPerAgent, setAverageInscriptionsPerAgent] = useState(0)
  const [graduationRate, setGraduationRate] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const students = await getStudents()
        const programs = await getPrograms()
        const agents = await getAgents()
        const inscriptions = await getInscriptions()

        setStudentCount(students.length)
        setProgramCount(programs.length)
        setAgentCount(agents.length)
        setInscriptionCount(inscriptions.length)

        // Calculate top program
        const programCounts = programs.map(program => ({
          name: program.nombre_programa,
          count: inscriptions.filter(i => i.programa_id === program.programa_id).length
        }))
        const top = programCounts.reduce((max, p) => p.count > max.count ? p : max, { name: '', count: 0 })
        setTopProgram(top)

        // Calculate active students (enrolled in at least one program)
        const activeStudents = new Set(inscriptions.map(i => i.cedula_estudiante))
        setActiveStudentCount(activeStudents.size)

        // Calculate average inscriptions per agent
        setAverageInscriptionsPerAgent((inscriptions.length / agents.length).toFixed(2))

        // Calculate graduation rate (assuming 10% of active students graduate each year)
        setGraduationRate((activeStudents.size * 0.1 / students.length * 100).toFixed(2))

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
            <CardTitle className="text-sm font-medium">Total Agentes</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentCount}</div>
            <p className="text-xs text-muted-foreground">Agentes registrados</p>
          </CardContent>
        </Card>
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inscripciones</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inscriptionCount}</div>
            <p className="text-xs text-muted-foreground">Inscripciones realizadas</p>
          </CardContent>
        </Card>
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programa más Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topProgram.name}</div>
            <p className="text-xs text-muted-foreground">{topProgram.count} inscripciones</p>
          </CardContent>
        </Card>
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudentCount}</div>
            <p className="text-xs text-muted-foreground">Estudiantes en programas</p>
          </CardContent>
        </Card>
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscripciones por Agente</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageInscriptionsPerAgent}</div>
            <p className="text-xs text-muted-foreground">Promedio de inscripciones</p>
          </CardContent>
        </Card>
        <Card className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Graduación</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graduationRate}%</div>
            <p className="text-xs text-muted-foreground">Estimado anual</p>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  )
}