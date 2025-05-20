import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider as ChakraUIProvider } from "@/components/ui/provider"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraUIProvider>
      <App />
    </ChakraUIProvider>
  </StrictMode>,
)
