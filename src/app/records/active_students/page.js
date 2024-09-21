import Dashboard from '@/components/dashboard'

export default function activeStudents() {
  return (
    <main>
      <Dashboard>
        <h1 className="text-3xl font-semibold mb-4 text-foreground">Estudiantes Egresados</h1>
        <p className="text-muted-foreground">Estudiantes Egresados</p>
      </Dashboard>
    </main>
  )
}