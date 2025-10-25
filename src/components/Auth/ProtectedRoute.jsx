// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/api';

// Componente para rutas que requieren autenticación
export const PrivateRoute = ({ children, user }) => {
  if (!user || !authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para rutas que requieren roles específicos
export const RoleRoute = ({ children, user, allowedRoles }) => {
  if (!user || !authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirigir al inicio si no tiene permisos
    return <Navigate to="/inicio" replace />;
  }
  
  return children;
};

// Componente para rutas de solo administrador
export const AdminRoute = ({ children, user }) => {
  return (
    <RoleRoute user={user} allowedRoles={['admin']}>
      {children}
    </RoleRoute>
  );
};

// Componente para rutas de administrador o supervisor
export const SupervisorRoute = ({ children, user }) => {
  return (
    <RoleRoute user={user} allowedRoles={['admin', 'supervisor']}>
      {children}
    </RoleRoute>
  );
};

export default { PrivateRoute, RoleRoute, AdminRoute, SupervisorRoute };