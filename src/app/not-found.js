import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Oops! Page not found.</p>
      <Button asChild>
        <Link href="/">
          Go back home
        </Link>
      </Button>
    </div>
  )
}