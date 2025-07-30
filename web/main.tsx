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
