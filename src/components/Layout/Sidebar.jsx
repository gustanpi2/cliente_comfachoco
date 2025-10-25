// src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  FileText, 
  BarChart3, 
  Heart, 
  User, 
  HelpCircle,
  ChevronLeft
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, userRole = 'empleado' }) => {
  
  // Definir elementos del menú con permisos
  const menuItems = [
    {
      name: 'Inicio',
      icon: Home,
      path: '/inicio',
      roles: ['admin', 'supervisor', 'empleado']
    },
    {
      name: 'Calendario',
      icon: Calendar,
      path: '/calendario',
      roles: ['admin', 'supervisor', 'empleado']
    },
    {
      name: 'Mis Solicitudes',
      icon: FileText,
      path: '/solicitudes',
      roles: ['admin', 'supervisor', 'empleado']
    },
    {
      name: 'Reportes',
      icon: BarChart3,
      path: '/reportes',
      roles: ['admin', 'supervisor'] // Solo admin y supervisor
    },
    {
      name: 'Bienestar',
      icon: Heart,
      path: '/bienestar',
      roles: ['admin', 'supervisor', 'empleado']
    },
    {
      name: 'Mi Perfil',
      icon: User,
      path: '/empleado',
      roles: ['admin', 'supervisor', 'empleado']
    },
    {
      name: 'Ayuda y Soporte',
      icon: HelpCircle,
      path: '/soporte',
      roles: ['admin', 'supervisor', 'empleado']
    }
  ];

  // Filtrar items según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-green-600 to-blue-700 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header del Sidebar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Menú Principal</h2>
            <p className="text-xs text-white/70 mt-1">
              {userRole === 'admin' ? 'Administrador' : 
               userRole === 'supervisor' ? 'Supervisor' : 
               'Empleado'}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-green-700 shadow-lg font-semibold'
                        : 'text-white/90 hover:bg-white/10 hover:translate-x-1'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-lg p-3 text-xs">
            <p className="font-semibold mb-1">💡 Tip del día</p>
            <p className="text-white/80">
              Planifica tus vacaciones con anticipación para una mejor aprobación.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;