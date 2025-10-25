// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
// import Footer from "./components/Layout/Footer"; ❌ Eliminado
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register"; // ✅ Añadido

import PaginaInicio from "./components/Dashboard/pagina_inicio";
import PanelReportes from "./components/Reports/panel_reportes";
import EncuestasBienestar from "./components/Wellness/encuestas_bienestar";
import PerfilEmpleado from "./components/Profile/perfil_empleado";
import GestionSolicitudes from "./components/Requests/gestion_solicitudes";
import AdminSolicitudes from "./components/Admin/admin_solicitudes";
import AyudaSoporte from "./components/Support/ayuda_soporte";
import Calendar from "./components/Calendar/calendario_compartido";

import { authService } from "./services/api";

// Componente para rutas protegidas
const PrivateRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para rutas que requieren roles específicos
const RoleRoute = ({ children, user, allowedRoles }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/inicio" replace />;
  }
  
  return children;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Verificar token con el backend
          const response = await authService.verifyToken();
          setUser(response.user);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // Si el token no es válido, limpiar
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Manejar resize de ventana
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Manejar login exitoso
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Manejar logout
  const handleLogout = () => {
    setUser(null);
  };

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/inicio" replace /> : <Login onLogin={handleLogin} />
          } 
        />

        {/* ✅ Nueva ruta de Registro */}
        <Route
          path="/register"
          element={
            user ? <Navigate to="/inicio" replace /> : <Register />
          }
        />

        {/* Rutas Protegidas */}
        <Route
          path="/*"
          element={
            <PrivateRoute user={user}>
              <div className="flex flex-col h-screen bg-gray-100">
                {/* Contenedor principal con sidebar */}
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole={user?.rol} />

                  <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out">
                    <Navbar
                      user={user}
                      sidebarOpen={sidebarOpen}
                      onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                      onLogout={handleLogout}
                    />

                    <main className="flex-1 overflow-y-auto p-6 transition-all duration-300">
                      <Routes>
                        <Route path="/" element={<Navigate to="/inicio" replace />} />
                        <Route path="/inicio" element={<PaginaInicio user={user} />} />
                        <Route path="/calendario" element={<Calendar user={user} />} />
                        <Route path="/bienestar" element={<EncuestasBienestar user={user} />} />
                        <Route path="/empleado" element={<PerfilEmpleado user={user} />} />
                        
                        {/* RUTA DE SOLICITUDES - DIFERENTE SEGÚN ROL */}
                        <Route 
                          path="/solicitudes" 
                          element={
                            user?.rol === 'admin' || user?.rol === 'supervisor' ? (
                              <AdminSolicitudes user={user} />
                            ) : (
                              <GestionSolicitudes user={user} />
                            )
                          } 
                        />
                        
                        <Route path="/soporte" element={<AyudaSoporte user={user} />} />
                        
                        {/* Ruta solo para Admin y Supervisor */}
                        <Route 
                          path="/reportes" 
                          element={
                            <RoleRoute user={user} allowedRoles={['admin', 'supervisor']}>
                              <PanelReportes user={user} />
                            </RoleRoute>
                          } 
                        />
                      </Routes>
                    </main>

                    {/* <Footer /> ❌ Eliminado */}
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
