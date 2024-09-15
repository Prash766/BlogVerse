import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
    <Toaster richColors position='bottom-center'/>
    <App />
    </RecoilRoot>
  </StrictMode>,
)
