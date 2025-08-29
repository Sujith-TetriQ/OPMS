import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AdminRoutes from '@routes/AdminRoutes'
import LoginRoutes from '@routes/LoginRoutes'

export default function App() {
  return (
    <BrowserRouter>
      {/* Login Routes */}
      <LoginRoutes />

      {/* AdminRoutes */}
      <AdminRoutes />
    </BrowserRouter>
  )
}
