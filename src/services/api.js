// src/services/api.js - MEJORADO
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al registrar usuario' };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// ============================================
// SERVICIOS DE TIPOS DE SOLICITUD (NUEVO)
// ============================================

export const tiposSolicitudService = {
  getAll: async () => {
    try {
      const response = await api.get('/tipos-solicitud');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener tipos de solicitud' };
    }
  }
};

// ============================================
// SERVICIOS DE SOLICITUDES
// ============================================

export const solicitudesService = {
  getAll: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros).toString();
      const response = await api.get(`/solicitudes?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener solicitudes' };
    }
  },

  create: async (solicitudData) => {
    try {
      const response = await api.post('/solicitudes', solicitudData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear solicitud' };
    }
  },

  cancel: async (id) => {
    try {
      const response = await api.delete(`/solicitudes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al cancelar solicitud' };
    }
  }
};

// ============================================
// SERVICIOS DE SALDOS
// ============================================

export const saldosService = {
  getAll: async (anio = null) => {
    try {
      const params = anio ? `?anio=${anio}` : '';
      const response = await api.get(`/saldos${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener saldos' };
    }
  }
};

// ============================================
// SERVICIOS DE NOTIFICACIONES
// ============================================

export const notificacionesService = {
  getAll: async () => {
    try {
      const response = await api.get('/notificaciones');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener notificaciones' };
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notificaciones/${id}/leer`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar notificación' };
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notificaciones/leer-todas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar notificaciones' };
    }
  }
};

// ============================================
// SERVICIOS DE PERFIL
// ============================================

export const perfilService = {
  get: async () => {
    try {
      const response = await api.get('/perfil');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener perfil' };
    }
  }
};

// ============================================
// SERVICIOS DE CALENDARIO (NUEVO)
// ============================================

export const calendarioService = {
  getAusencias: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros).toString();
      const response = await api.get(`/calendario/ausencias?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener ausencias' };
    }
  }
};

// ============================================
// SERVICIOS DE ADMINISTRACIÓN (NUEVOS)
// ============================================

export const adminService = {
  getAllSolicitudes: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros).toString();
      const response = await api.get(`/admin/solicitudes?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener solicitudes' };
    }
  },

  aprobarSolicitud: async (id, comentarios = '') => {
    try {
      const response = await api.put(`/admin/solicitudes/${id}/aprobar`, { comentarios });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al aprobar solicitud' };
    }
  },

  rechazarSolicitud: async (id, comentarios = '') => {
    try {
      const response = await api.put(`/admin/solicitudes/${id}/rechazar`, { comentarios });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al rechazar solicitud' };
    }
  }
};

export default api;