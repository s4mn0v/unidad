import { ThemeProvider } from './components/ThemeProvider'
import AppRouter from './AppRouter'

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}

export default App