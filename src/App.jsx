import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

import AdminRoutes from './routes/AdminRoutes'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <AdminRoutes />
      </BrowserRouter>
    )
  }
}
