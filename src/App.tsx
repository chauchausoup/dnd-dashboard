import { ThemeProvider } from "@/components/context/theme-provider"
import DashboardContainer from "./components/dashboard-container";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DashboardContainer/>
    </ThemeProvider>
  )
}
