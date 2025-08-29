import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '@components/Login'

export default function LoginRoutes() {
  return (
    <Routes>
        <Route path='/login' element={<Login />} />
    </Routes>
  )
}
