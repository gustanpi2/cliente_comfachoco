// src/components/Auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, Briefcase, Building, Phone, Calendar,
  CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft
} from 'lucide-react';
import { authService } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    password: '',
    confirmPassword: '',
    cargo: '',
    departamento_id: '',
    tipo_empleado_id: '1', // Por defecto Administrativo
    telefono: '',
    fecha_ingreso: new Date().toISOString().split('T')[0]
  });

  const [errores, setErrores] = useState({});

  // Datos de selección
  const departamentos = [
    { id: 1, nombre: 'Recursos Humanos' },
    { id: 2, nombre: 'Tecnología' },
    { id: 3, nombre: 'Operaciones' },
    { id: 4, nombre: 'Administrativo' },
    { id: 5, nombre: 'Comercial' }
  ];

  const tiposEmpleado = [
    { id: 1, nombre: 'Administrativo', dias: 15 },
    { id: 2, nombre: 'Operativo', dias: 15 },
    { id: 3, nombre: 'Directivo', dias: 20 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre_completo.trim() || formData.nombre_completo.trim().length < 3) {
      nuevosErrores.nombre_completo = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      nuevosErrores.email = 'Formato de email inválido';
    }

    if (!formData.password || formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.tipo_empleado_id) {
      nuevosErrores.tipo_empleado_id = 'Selecciona un tipo de empleado';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      await authService.register(userData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login', { 
          state: { message: '¡Registro exitoso! Ahora puedes iniciar sesión.' }
        });
      }, 2000);

    } catch (err) {
      setError(err.error || 'Error al registrar usuario. Intenta nuevamente.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/login" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver al inicio de sesión
          </Link>
          
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 transform rotate-45 rounded-lg shadow-lg"></div>
              <div className="absolute w-9 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 transform rotate-45 rounded-lg"></div>
              <div className="relative z-10">
                <span className="text-white font-black text-sm drop-shadow-md">CCE</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 text-center">
            Únete al Portal de Comfachocó
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez García"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all ${
                  errores.nombre_completo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errores.nombre_completo && (
              <p className="text-red-600 text-xs mt-1">{errores.nombre_completo}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Corporativo *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu.email@comfachoco.com"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all ${
                  errores.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errores.email && (
              <p className="text-red-600 text-xs mt-1">{errores.email}</p>
            )}
          </div>

          {/* Contraseñas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all ${
                    errores.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                </button>
              </div>
              {errores.password && (
                <p className="text-red-600 text-xs mt-1">{errores.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Repite tu contraseña"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all ${
                    errores.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                </button>
              </div>
              {errores.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">{errores.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Cargo y Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  placeholder="Ej: Analista"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  name="departamento_id"
                  value={formData.departamento_id}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona...</option>
                  {departamentos.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tipo de Empleado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Empleado *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tiposEmpleado.map(tipo => (
                <label
                  key={tipo.id}
                  className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.tipo_empleado_id === tipo.id.toString()
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo_empleado_id"
                    value={tipo.id}
                    checked={formData.tipo_empleado_id === tipo.id.toString()}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <p className="font-semibold text-sm text-gray-900">{tipo.nombre}</p>
                  <p className="text-xs text-gray-600 mt-1">{tipo.dias} días/año</p>
                  {formData.tipo_empleado_id === tipo.id.toString() && (
                    <CheckCircle className="absolute top-2 right-2 text-green-600" size={16} />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Teléfono y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="3001234567"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="fecha_ingreso"
                  value={formData.fecha_ingreso}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Términos */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              Al registrarte, aceptas nuestros términos y políticas de privacidad
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>

            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-semibold text-green-600 hover:text-green-700 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;