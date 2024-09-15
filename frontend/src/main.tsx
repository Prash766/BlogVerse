import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'



const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <RecoilRoot>
    <Toaster richColors position='bottom-center'/>
    <QueryClientProvider client={queryClient} >
    <App />
    </QueryClientProvider>
    </RecoilRoot>
  </StrictMode>,
)
