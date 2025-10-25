// src/components/Requests/gestion_solicitudes.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { tiposSolicitudService, solicitudesService, saldosService } from '../../services/api';

const GestionSolicitudes = ({ user }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [saldos, setSaldos] = useState([]);
  const [tiposSolicitud, setTiposSolicitud] = useState([]); // NUEVO: Lista de tipos
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    tipo_solicitud_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    dias_solicitados: 1,
    motivo: ''
  });

  const [filtroEstado, setFiltroEstado] = useState('todas');

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [solicitudesData, saldosData, tiposData] = await Promise.all([
        solicitudesService.getAll(),
        saldosService.getAll(),
        tiposSolicitudService.getAll() // NUEVO: Cargar tipos de solicitud
      ]);
      setSolicitudes(solicitudesData);
      setSaldos(saldosData);
      setTiposSolicitud(tiposData); // NUEVO: Guardar tipos
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Calcular días entre fechas
  const calcularDias = (inicio, fin) => {
    if (!inicio || !fin) return 0;
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const diffTime = Math.abs(fechaFin - fechaInicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...nuevaSolicitud, [name]: value };
    
    // Si cambian las fechas, recalcular días
    if (name === 'fecha_inicio' || name === 'fecha_fin') {
      const dias = calcularDias(
        name === 'fecha_inicio' ? value : newData.fecha_inicio,
        name === 'fecha_fin' ? value : newData.fecha_fin
      );
      newData.dias_solicitados = dias;
    }
    
    setNuevaSolicitud(newData);
    setError('');
  };

  // NUEVO: Obtener días disponibles por tipo_solicitud_id
  const getDiasDisponibles = (tipoId) => {
    // Buscar el tipo de solicitud
    const tipo = tiposSolicitud.find(t => t.id === parseInt(tipoId));
    if (!tipo) return 0;
    
    // Buscar el saldo correspondiente al nombre del tipo
    const saldo = saldos.find(s => s.tipo_solicitud === tipo.nombre);
    return saldo ? saldo.dias_disponibles : 0;
  };

  // Enviar nueva solicitud
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones
      if (!nuevaSolicitud.tipo_solicitud_id || !nuevaSolicitud.fecha_inicio || !nuevaSolicitud.fecha_fin) {
        setError('Todos los campos son obligatorios');
        setSubmitLoading(false);
        return;
      }

      // Verificar días disponibles
      const diasDisponibles = getDiasDisponibles(nuevaSolicitud.tipo_solicitud_id);
      
      if (diasDisponibles < nuevaSolicitud.dias_solicitados) {
        setError(`No tienes suficientes días disponibles. Disponibles: ${diasDisponibles}`);
        setSubmitLoading(false);
        return;
      }

      // Enviar solicitud
      await solicitudesService.create(nuevaSolicitud);
      
      setSuccess('¡Solicitud creada exitosamente!');
      setShowModal(false);
      
      // Resetear formulario
      setNuevaSolicitud({
        tipo_solicitud_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        dias_solicitados: 1,
        motivo: ''
      });
      
      // Recargar datos
      await loadData();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      setError(error.error || 'Error al crear la solicitud');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Cancelar solicitud
  const handleCancelar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      return;
    }

    try {
      await solicitudesService.cancel(id);
      setSuccess('Solicitud cancelada exitosamente');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al cancelar solicitud:', error);
      setError(error.error || 'Error al cancelar la solicitud');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filtrar solicitudes
  const solicitudesFiltradas = filtroEstado === 'todas' 
    ? solicitudes 
    : solicitudes.filter(s => s.estado === filtroEstado);

  // Estados de solicitud
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
          <p className="text-gray-600 mt-1">Administra tus solicitudes de vacaciones y permisos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} className="mr-2" />
          Nueva Solicitud
        </button>
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

      {/* Resumen de Saldos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {saldos.map((saldo, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: saldo.color_hex || '#3B82F6' }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{saldo.tipo_solicitud}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Disponibles:</span>
                <span className="font-bold text-green-600">{saldo.dias_disponibles} días</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usados:</span>
                <span className="text-gray-700">{saldo.dias_usados} días</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pendientes:</span>
                <span className="text-yellow-600">{saldo.dias_pendientes} días</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">{saldo.dias_totales} días</span>
                </div>
              </div>
            </div>
            {/* Barra de progreso */}
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${(saldo.dias_usados / saldo.dias_totales) * 100}%`,
                  backgroundColor: saldo.color_hex || '#3B82F6'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4">
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
            <p>No tienes solicitudes {filtroEstado !== 'todas' ? filtroEstado + 's' : ''}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
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
                    <td className="px-6 py-4 whitespace-nowrap">
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
                      {solicitud.estado === 'pendiente' && (
                        <button
                          onClick={() => handleCancelar(solicitud.id)}
                          className="text-red-600 hover:text-red-800 font-medium flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Cancelar
                        </button>
                      )}
                      {solicitud.estado !== 'pendiente' && (
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

      {/* Modal Nueva Solicitud */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Solicitud</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tipo de Solicitud - CORREGIDO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Solicitud
                  </label>
                  <select
                    name="tipo_solicitud_id"
                    value={nuevaSolicitud.tipo_solicitud_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecciona un tipo</option>
                    {tiposSolicitud.map((tipo) => {
                      const diasDisponibles = getDiasDisponibles(tipo.id);
                      return (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre} ({diasDisponibles} días disponibles)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Fecha Inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={nuevaSolicitud.fecha_inicio}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={nuevaSolicitud.fecha_fin}
                    onChange={handleInputChange}
                    min={nuevaSolicitud.fecha_inicio || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Días Calculados */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Días solicitados:</strong> {nuevaSolicitud.dias_solicitados}
                  </p>
                </div>

                {/* Motivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo (opcional)
                  </label>
                  <textarea
                    name="motivo"
                    value={nuevaSolicitud.motivo}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe el motivo de tu solicitud..."
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={submitLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitLoading ? 'Enviando...' : 'Enviar Solicitud'}
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

export default GestionSolicitudes;