import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@myorg/auth'

const queryClient = new QueryClient()

function render() {
  const root = createRoot(document.getElementById('root')!)
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

render()

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    render()
  })
}
