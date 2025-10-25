import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Users,
  Filter,
  RefreshCw
} from 'lucide-react';

// SERVICIO DE CALENDARIO
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const calendarioService = {
  getAusencias: async (filtros = {}) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(filtros).toString();
      const response = await fetch(`${API_URL}/calendario/ausencias?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al obtener ausencias');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

const CalendarioCompartido = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('todos');
  const [ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const departamentos = ['todos', 'RRHH', 'Tecnología', 'Operaciones', 'Administrativo', 'Comercial'];

  // Cargar ausencias cuando cambie el mes o departamento
  useEffect(() => {
    loadAusencias();
  }, [currentDate, selectedDepartment]);

  const loadAusencias = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await calendarioService.getAusencias({
        mes: currentDate.getMonth() + 1,
        anio: currentDate.getFullYear(),
        departamento: selectedDepartment
      });
      setAusencias(data);
    } catch (error) {
      console.error('Error al cargar ausencias:', error);
      setError('Error al cargar el calendario');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getAusenciasForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return ausencias.filter(ausencia => {
      return dateStr >= ausencia.fechaInicio && dateStr <= ausencia.fechaFin;
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  // Mapeo de colores
  const getColorClass = (colorHex) => {
    const colorMap = {
      '#10B981': 'bg-green-500',
      '#3B82F6': 'bg-blue-500',
      '#F59E0B': 'bg-orange-500',
      '#8B5CF6': 'bg-purple-500',
      '#EF4444': 'bg-red-500',
      '#06B6D4': 'bg-cyan-500'
    };
    return colorMap[colorHex] || 'bg-blue-500';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendario del Equipo</h1>
        <p className="text-gray-600">Visualiza las ausencias programadas de tu equipo</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Controles del calendario */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <ChevronLeft size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
              {monthNames[month]} {year}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <ChevronRight size={24} />
            </button>
            
            <button
              onClick={today}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              Hoy
            </button>

            <button
              onClick={loadAusencias}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
              title="Recargar"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                {departamentos.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'todos' ? 'Todos los departamentos' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="p-4 text-center font-semibold text-gray-700 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const ausenciasDelDia = day ? getAusenciasForDay(day) : [];
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-b border-r border-gray-200 ${
                  !day ? 'bg-gray-50' : ''
                } ${isToday(day) ? 'bg-blue-50' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday(day) ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {ausenciasDelDia.map(ausencia => (
                        <div
                          key={ausencia.id}
                          className={`${getColorClass(ausencia.color)} text-white text-xs p-1 rounded truncate`}
                          title={`${ausencia.empleado} - ${ausencia.tipo}`}
                        >
                          {ausencia.empleado.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Tipos de Ausencia</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Vacaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Permiso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-700">Licencia Médica</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-700">Licencia Familiar</span>
          </div>
        </div>
      </div>

      {/* Lista de próximas ausencias */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={20} />
          Ausencias del Mes ({ausencias.length})
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando...</p>
          </div>
        ) : ausencias.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No hay ausencias programadas para este mes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ausencias.map(ausencia => (
              <div key={ausencia.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${getColorClass(ausencia.color)} rounded-full`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{ausencia.empleado}</p>
                    <p className="text-sm text-gray-600">{ausencia.departamento || 'Sin departamento'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{ausencia.tipo}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(ausencia.fechaInicio).toLocaleDateString('es-ES')} - {new Date(ausencia.fechaFin).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioCompartido;