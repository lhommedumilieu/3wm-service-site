import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { installerCaptureErreurs } from './lib/errorReporting.js'
import { installerRechargementSiNouvelleVersion } from './lib/rechargementVersion.js'

installerRechargementSiNouvelleVersion()
installerCaptureErreurs()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
