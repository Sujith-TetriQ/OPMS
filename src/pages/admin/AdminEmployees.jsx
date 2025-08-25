import React from 'react';
import { Outlet } from 'react-router-dom';
import './admin.css';

export default function AdminEmployees() {
  return (
    <div className="admin-employees-wrapper">
      <Outlet /> {/* This will render the child view components */}
    </div>
  );
}
