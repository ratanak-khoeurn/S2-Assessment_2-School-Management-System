import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Dashboard from './dashboard/Dashboard.tsx'
import DepartmentPage from './departments/DepartmentPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Dashboard />
    {/* <App /> */}
    {/* <DepartmentPage /> */}
  </StrictMode>,
)
