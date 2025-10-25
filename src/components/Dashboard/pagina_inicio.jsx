import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';

const PaginaInicio = ({ user }) => {
  const navigate = useNavigate();
  
  const [stats] = useState({
    diasDisponibles: 12,
    solicitudesPendientes: 2,
    permisosAprobados: 5,
    proximasVacaciones: '15 días'
  });

  const [recentRequests] = useState([
    {
      id: 1,
      tipo: 'Vacaciones',
      fecha: '2025-11-10 - 2025-11-15',
      estado: 'pendiente',
      dias: 5
    },
    {
      id: 2,
      tipo: 'Permiso',
      fecha: '2025-10-28',
      estado: 'aprobada',
      dias: 1
    }
  ]);

  const getStatusColor = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      aprobada: 'bg-green-100 text-green-800',
      rechazada: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (estado) => {
    const texts = {
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada'
    };
    return texts[estado] || estado;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado de Bienvenida */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {user?.nombre_completo?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus vacaciones y permisos de forma fácil y transparente
        </p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar size={32} />
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
              <span className="text-sm font-semibold">2025</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.diasDisponibles}</h3>
          <p className="text-green-100 text-sm">Días disponibles</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock size={32} />
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
              <span className="text-sm font-semibold">Activas</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.solicitudesPendientes}</h3>
          <p className="text-yellow-100 text-sm">Solicitudes pendientes</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} />
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
              <span className="text-sm font-semibold">2025</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.permisosAprobados}</h3>
          <p className="text-blue-100 text-sm">Permisos aprobados</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={32} />
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
              <span className="text-sm font-semibold">Próximo</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.proximasVacaciones}</h3>
          <p className="text-purple-100 text-sm">Para tus vacaciones</p>
        </div>
      </div>

      {/* Enlaces Rápidos y Solicitudes Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/solicitudes')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-between group"
              >
                <span className="font-medium">Nueva Solicitud</span>
                <Plus size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/calendario')}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group"
              >
                <span className="font-medium">Ver Calendario</span>
                <Calendar size={20} className="text-gray-400 group-hover:text-blue-500" />
              </button>

              <button
                onClick={() => navigate('/solicitudes')}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex items-center justify-between group"
              >
                <span className="font-medium">Mis Solicitudes</span>
                <FileText size={20} className="text-gray-400 group-hover:text-green-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Solicitudes Recientes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Solicitudes Recientes
              </h2>
              <button
                onClick={() => navigate('/solicitudes')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                Ver todas
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>

            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FileText size={20} className="text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-800">
                        {request.tipo}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.estado)}`}>
                      {getStatusText(request.estado)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{request.fecha}</span>
                    <span className="font-medium">{request.dias} día(s)</span>
                  </div>
                </div>
              ))}

              {recentRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No tienes solicitudes recientes</p>
                  <button
                    onClick={() => navigate('/solicitudes')}
                    className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Crear una solicitud
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje Institucional */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-6 border border-green-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tu Bienestar es Nuestra Prioridad
            </h3>
            <p className="text-gray-600 leading-relaxed">
              En Comfachocó entendemos la importancia del equilibrio entre la vida laboral y personal. 
              Este portal está diseñado para que gestiones tus tiempos de descanso de forma simple y 
              transparente. Recuerda que tomarte tiempo para ti es fundamental para tu bienestar y productividad.
            </p>
            <button
              onClick={() => navigate('/bienestar')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Conoce más sobre bienestar
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaInicio;
