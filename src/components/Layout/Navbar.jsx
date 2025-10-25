// src/components/Layout/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService, notificacionesService } from '../../services/api';

const Navbar = ({ user, onToggleSidebar, sidebarOpen, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();
  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Cargar notificaciones al montar
  useEffect(() => {
    loadNotifications();
  }, []);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar notificaciones
  const loadNotifications = async () => {
    try {
      const notifs = await notificacionesService.getAll();
      setNotificationsList(notifs);
      const unreadCount = notifs.filter(n => !n.leida).length;
      setNotificationsCount(unreadCount);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  // Manejar logout
  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      
      // Llamar al servicio de logout
      await authService.logout();
      
      // Llamar callback si existe
      if (onLogout) {
        onLogout();
      }
      
      // Redirigir al login
      navigate('/login');
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aunque falle, limpiar localmente y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/empleado');
  };

  // Marcar notificación como leída
  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.leida) {
        await notificacionesService.markAsRead(notif.id);
        await loadNotifications(); // Recargar notificaciones
      }
      setShowNotifications(false);
      
      // Navegar si tiene solicitud asociada
      if (notif.solicitud_id) {
        navigate('/solicitudes');
      }
    } catch (error) {
      console.error('Error al marcar notificación:', error);
    }
  };

  // Formatear tiempo relativo
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Hace un momento';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
    return date.toLocaleDateString();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Toggle Sidebar */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/inicio')}>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-3 py-1 rounded-lg font-bold text-xl">
                C
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800 hidden sm:block">
                Comfachocó Portal
              </span>
            </div>
          </div>

          {/* Usuario y Notificaciones */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notificaciones */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
                aria-label="Notificaciones"
              >
                <Bell size={24} className="text-gray-600" />
                {notificationsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {notificationsCount > 9 ? '9+' : notificationsCount}
                  </span>
                )}
              </button>

              {/* Dropdown de Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                    {notificationsCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                        {notificationsCount} nuevas
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notificationsList.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>No tienes notificaciones</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notificationsList.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notif.leida ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleNotificationClick(notif)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notif.titulo}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {notif.mensaje}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {getTimeAgo(notif.created_at)}
                                </p>
                              </div>
                              {!notif.leida && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {notificationsList.length > 0 && (
                    <div className="p-3 border-t border-gray-200 text-center">
                      <button 
                        onClick={() => navigate('/notificaciones')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ver todas las notificaciones
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Menú de Usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Menú de usuario"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.nombre_completo?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.nombre_completo?.split(' ')[0] || 'Usuario'}
                </span>
              </button>

              {/* Dropdown de Usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">
                      {user?.nombre_completo || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{user?.cargo || 'Sin cargo'}</p>
                    {user?.email && (
                      <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                    )}
                    {user?.rol && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {user.rol === 'admin' ? 'Administrador' : user.rol === 'supervisor' ? 'Supervisor' : 'Empleado'}
                      </span>
                    )}
                  </div>
                  <div className="py-2">
                    <button 
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                    >
                      <User size={16} className="mr-3 text-gray-500" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={loadingLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors disabled:opacity-50"
                    >
                      <LogOut size={16} className="mr-3" />
                      {loadingLogout ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;