// src/components/Admin/admin_solicitudes.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, User, Filter } from 'lucide-react';
import { adminService } from '../../services/api';

const AdminSolicitudes = ({ user }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [showModal, setShowModal] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [accion, setAccion] = useState(''); // 'aprobar' o 'rechazar'
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const solicitudesData = await adminService.getAllSolicitudes();
      setSolicitudes(solicitudesData);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setAccion('aprobar');
    setComentarios('');
    setShowModal(true);
  };

  const handleRechazar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setAccion('rechazar');
    setComentarios('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    setSuccess('');

    try {
      if (accion === 'aprobar') {
        await adminService.aprobarSolicitud(solicitudSeleccionada.id, comentarios);
        setSuccess('Solicitud aprobada exitosamente');
      } else {
        if (!comentarios.trim()) {
          setError('Debes proporcionar un motivo para rechazar la solicitud');
          setSubmitLoading(false);
          return;
        }
        await adminService.rechazarSolicitud(solicitudSeleccionada.id, comentarios);
        setSuccess('Solicitud rechazada exitosamente');
      }

      setShowModal(false);
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al procesar solicitud:', error);
      setError(error.error || 'Error al procesar la solicitud');
    } finally {
      setSubmitLoading(false);
    }
  };

  const solicitudesFiltradas = filtroEstado === 'todas' 
    ? solicitudes 
    : solicitudes.filter(s => s.estado === filtroEstado);

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendiente' },
      aprobada: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Aprobada' },
      rechazada: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rechazada' },
      cancelada: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: 'Cancelada' }
    };
    const badge = badges[estado] || badges.pendiente;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon size={14} className="mr-1" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Solicitudes</h1>
          <p className="text-gray-600 mt-1">Revisa y gestiona todas las solicitudes del equipo</p>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-3xl font-bold mt-1">{solicitudes.length}</p>
            </div>
            <Calendar size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pendientes</p>
              <p className="text-3xl font-bold mt-1">
                {solicitudes.filter(s => s.estado === 'pendiente').length}
              </p>
            </div>
            <Clock size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Aprobadas</p>
              <p className="text-3xl font-bold mt-1">
                {solicitudes.filter(s => s.estado === 'aprobada').length}
              </p>
            </div>
            <CheckCircle size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Rechazadas</p>
              <p className="text-3xl font-bold mt-1">
                {solicitudes.filter(s => s.estado === 'rechazada').length}
              </p>
            </div>
            <XCircle size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroEstado('todas')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === 'todas'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({solicitudes.length})
          </button>
          <button
            onClick={() => setFiltroEstado('pendiente')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === 'pendiente'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendientes ({solicitudes.filter(s => s.estado === 'pendiente').length})
          </button>
          <button
            onClick={() => setFiltroEstado('aprobada')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === 'aprobada'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aprobadas ({solicitudes.filter(s => s.estado === 'aprobada').length})
          </button>
          <button
            onClick={() => setFiltroEstado('rechazada')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === 'rechazada'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rechazadas ({solicitudes.filter(s => s.estado === 'rechazada').length})
          </button>
        </div>
      </div>

      {/* Lista de Solicitudes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {solicitudesFiltradas.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay solicitudes {filtroEstado !== 'todas' ? filtroEstado + 's' : ''}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {solicitudesFiltradas.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {solicitud.usuario_nombre || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {solicitud.departamento_nombre || 'Sin departamento'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{solicitud.tipo_solicitud}</div>
                      {solicitud.motivo && (
                        <div className="text-xs text-gray-500 mt-1">{solicitud.motivo}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(solicitud.fecha_inicio).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-sm text-gray-500">
                        hasta {new Date(solicitud.fecha_fin).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {solicitud.dias_solicitados} días
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEstadoBadge(solicitud.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {solicitud.estado === 'pendiente' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAprobar(solicitud)}
                            className="text-green-600 hover:text-green-800 font-medium flex items-center"
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleRechazar(solicitud)}
                            className="text-red-600 hover:text-red-800 font-medium flex items-center"
                          >
                            <XCircle size={16} className="mr-1" />
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {accion === 'aprobar' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
              </h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Empleado:</strong> {solicitudSeleccionada?.usuario_nombre}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Tipo:</strong> {solicitudSeleccionada?.tipo_solicitud}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Días:</strong> {solicitudSeleccionada?.dias_solicitados}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios {accion === 'rechazar' && <span className="text-red-600">*</span>}
                  </label>
                  <textarea
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={accion === 'aprobar' ? 'Comentarios opcionales...' : 'Motivo del rechazo...'}
                    required={accion === 'rechazar'}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={submitLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className={`flex-1 px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 ${
                      accion === 'aprobar'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }`}
                  >
                    {submitLoading ? 'Procesando...' : accion === 'aprobar' ? 'Aprobar' : 'Rechazar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSolicitudes;