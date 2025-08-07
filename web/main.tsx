import { render } from 'preact'
import { LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso'
import { StyledEngineProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { DialogsProvider } from '@toolpad/core/useDialogs'

import AppTheme from './theme/AppTheme'
import { Home, Admin } from './views'
import { LanguageProvider } from './helpers/i18n'

import './index.css'

function NotFound() {
  return <div>Not Found</div>
}

function Main() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <StyledEngineProvider injectFirst>
            <AppTheme>
              <CssBaseline enableColorScheme />
              <DialogsProvider>
                <Router>
                  <Route component={Home} path="/" />
                  <Route component={Admin} path="/admin/:token" />
                  <Route component={NotFound} default />
                </Router>
              </DialogsProvider>
            </AppTheme>
          </StyledEngineProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </LocationProvider>
  )
}

render(<Main />, document.getElementById('app')!)

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope)
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                if (confirm('New version available. Refresh to update?')) {
                  window.location.reload()
                }
              }
            })
          }
        })
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error)
      })
  })
}

// Handle app install prompt
let deferredPrompt: any
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later
  deferredPrompt = e
  
  // Show install button or banner (you can customize this)
  console.log('App can be installed')
})

// Optional: Add install button functionality
export function showInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      deferredPrompt = null
    })
  }
}
