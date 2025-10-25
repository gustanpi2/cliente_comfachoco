// server.js - CORREGIDO Y MEJORADO
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'comfachoco_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Pool de conexiones
const pool = mysql.createPool(dbConfig);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt_aqui', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

// Registro de nuevo usuario
app.post('/api/auth/register', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { 
      nombre_completo, 
      email, 
      password, 
      cargo, 
      departamento_id, 
      tipo_empleado_id, 
      telefono, 
      fecha_ingreso 
    } = req.body;

    // Validar campos requeridos
    if (!nombre_completo || !email || !password || !tipo_empleado_id) {
      await connection.rollback();
      return res.status(400).json({ 
        error: 'Nombre, email, contraseña y tipo de empleado son requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await connection.rollback();
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Verificar si el email ya existe
    const [existingUsers] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      await connection.rollback();
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const [result] = await connection.query(
      `INSERT INTO usuarios (
        nombre_completo, email, password, cargo, departamento_id, 
        tipo_empleado_id, telefono, fecha_ingreso, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'activo')`,
      [
        nombre_completo, 
        email, 
        hashedPassword, 
        cargo || null, 
        departamento_id || null, 
        tipo_empleado_id, 
        telefono || null, 
        fecha_ingreso || new Date()
      ]
    );

    const userId = result.insertId;

    // Inicializar saldos para el nuevo usuario
    const anio = new Date().getFullYear();
    await connection.query('CALL inicializar_saldos_usuario(?, ?)', [userId, anio]);

    // Auditoría
    await connection.query(
      `INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, ip_address)
       VALUES (?, 'registro', 'usuarios', ?, ?)`,
      [userId, userId, req.ip]
    );

    await connection.commit();

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      userId: userId
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  } finally {
    connection.release();
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const [users] = await pool.query(
      `SELECT u.*, te.nombre as tipo_empleado_nombre, d.nombre as departamento_nombre
       FROM usuarios u
       LEFT JOIN tipos_empleado te ON u.tipo_empleado_id = te.id
       LEFT JOIN departamentos d ON u.departamento_id = d.id
       WHERE u.email = ? AND u.estado = 'activo'`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    let rol = 'empleado';
    if (user.es_rrhh) {
      rol = 'admin';
    } else if (user.es_supervisor) {
      rol = 'supervisor';
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        rol: rol
      },
      process.env.JWT_SECRET || 'tu_secreto_jwt_aqui',
      { expiresIn: '24h' }
    );

    await pool.query(
      `INSERT INTO auditoria (usuario_id, accion, tabla_afectada, ip_address)
       VALUES (?, 'login', 'usuarios', ?)`,
      [user.id, req.ip]
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        email: user.email,
        cargo: user.cargo,
        departamento: user.departamento_nombre,
        rol: rol,
        es_supervisor: user.es_supervisor,
        es_rrhh: user.es_rrhh,
        avatar_url: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Verificar token
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.*, te.nombre as tipo_empleado_nombre, d.nombre as departamento_nombre
       FROM usuarios u
       LEFT JOIN tipos_empleado te ON u.tipo_empleado_id = te.id
       LEFT JOIN departamentos d ON u.departamento_id = d.id
       WHERE u.id = ? AND u.estado = 'activo'`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];
    let rol = 'empleado';
    if (user.es_rrhh) rol = 'admin';
    else if (user.es_supervisor) rol = 'supervisor';

    res.json({
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        email: user.email,
        cargo: user.cargo,
        departamento: user.departamento_nombre,
        rol: rol,
        es_supervisor: user.es_supervisor,
        es_rrhh: user.es_rrhh,
        avatar_url: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO auditoria (usuario_id, accion, tabla_afectada, ip_address)
       VALUES (?, 'logout', 'usuarios', ?)`,
      [req.user.id, req.ip]
    );

    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ============================================
// RUTAS DE TIPOS DE SOLICITUD (NUEVO)
// ============================================

app.get('/api/tipos-solicitud', authenticateToken, async (req, res) => {
  try {
    const [tipos] = await pool.query(
      `SELECT id, nombre, descripcion, color_hex, requiere_aprobacion 
       FROM tipos_solicitud 
       ORDER BY nombre`
    );

    res.json(tipos);

  } catch (error) {
    console.error('Error al obtener tipos de solicitud:', error);
    res.status(500).json({ error: 'Error al obtener tipos de solicitud' });
  }
});

// ============================================
// RUTAS DE SOLICITUDES - MEJORADAS
// ============================================

// Obtener solicitudes del usuario
app.get('/api/solicitudes', authenticateToken, async (req, res) => {
  try {
    const { estado, desde, hasta } = req.query;
    
    let query = `SELECT * FROM vista_solicitudes_completa WHERE usuario_id = ?`;
    let params = [req.user.id];

    if (estado) {
      query += ` AND estado = ?`;
      params.push(estado);
    }

    if (desde && hasta) {
      query += ` AND fecha_inicio BETWEEN ? AND ?`;
      params.push(desde, hasta);
    }

    query += ` ORDER BY created_at DESC`;

    const [solicitudes] = await pool.query(query, params);
    res.json(solicitudes);

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// Crear nueva solicitud - CORREGIDA
app.post('/api/solicitudes', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { tipo_solicitud_id, fecha_inicio, fecha_fin, dias_solicitados, motivo } = req.body;

    // Validar campos
    if (!tipo_solicitud_id || !fecha_inicio || !fecha_fin || !dias_solicitados) {
      await connection.rollback();
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar que los días sean positivos
    if (dias_solicitados <= 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Los días solicitados deben ser mayor a 0' });
    }

    // Obtener año de la solicitud
    const anio = new Date(fecha_inicio).getFullYear();

    // Verificar si existe el saldo, si no, crearlo
    const [saldos] = await connection.query(
      `SELECT dias_disponibles, dias_totales FROM saldos_dias 
       WHERE usuario_id = ? AND tipo_solicitud_id = ? AND anio = ?`,
      [req.user.id, tipo_solicitud_id, anio]
    );

    if (saldos.length === 0) {
      // Si no existe saldo, crearlo según el tipo de empleado
      const [usuario] = await connection.query(
        `SELECT u.tipo_empleado_id, te.dias_vacaciones_anuales, te.dias_permiso_mensual
         FROM usuarios u
         JOIN tipos_empleado te ON u.tipo_empleado_id = te.id
         WHERE u.id = ?`,
        [req.user.id]
      );

      if (usuario.length === 0) {
        await connection.rollback();
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      // Determinar días totales según tipo de solicitud
      let dias_totales;
      switch (parseInt(tipo_solicitud_id)) {
        case 1: // Vacaciones
          dias_totales = usuario[0].dias_vacaciones_anuales;
          break;
        case 2: // Permiso
          dias_totales = usuario[0].dias_permiso_mensual * 12;
          break;
        case 3: // Licencia Médica
          dias_totales = 30;
          break;
        case 4: // Licencia Familiar
          dias_totales = 10;
          break;
        default:
          dias_totales = 0;
      }

      // Crear el saldo
      await connection.query(
        `INSERT INTO saldos_dias (usuario_id, tipo_solicitud_id, anio, dias_totales, dias_usados, dias_pendientes)
         VALUES (?, ?, ?, ?, 0, 0)`,
        [req.user.id, tipo_solicitud_id, anio, dias_totales]
      );

      // Verificar nuevamente los días disponibles
      const [nuevosSaldos] = await connection.query(
        `SELECT dias_disponibles FROM saldos_dias 
         WHERE usuario_id = ? AND tipo_solicitud_id = ? AND anio = ?`,
        [req.user.id, tipo_solicitud_id, anio]
      );

      if (nuevosSaldos[0].dias_disponibles < dias_solicitados) {
        await connection.rollback();
        return res.status(400).json({ 
          error: 'No tienes suficientes días disponibles',
          disponibles: nuevosSaldos[0].dias_disponibles,
          solicitados: dias_solicitados
        });
      }
    } else {
      // Verificar días disponibles
      if (saldos[0].dias_disponibles < dias_solicitados) {
        await connection.rollback();
        return res.status(400).json({ 
          error: 'No tienes suficientes días disponibles',
          disponibles: saldos[0].dias_disponibles,
          solicitados: dias_solicitados,
          totales: saldos[0].dias_totales
        });
      }
    }

    // Crear solicitud
    const [result] = await connection.query(
      `INSERT INTO solicitudes (usuario_id, tipo_solicitud_id, fecha_inicio, fecha_fin, dias_solicitados, motivo, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
      [req.user.id, tipo_solicitud_id, fecha_inicio, fecha_fin, dias_solicitados, motivo || '']
    );

    // El trigger actualizar_dias_pendientes_insert se encargará de actualizar los días pendientes

    // Crear notificación para supervisores/admin
    const [supervisores] = await connection.query(
      `SELECT id FROM usuarios WHERE (es_supervisor = TRUE OR es_rrhh = TRUE) AND estado = 'activo'`
    );

    for (const supervisor of supervisores) {
      await connection.query(
        `INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, solicitud_id)
         VALUES (?, 'Nueva Solicitud', 'Tienes una nueva solicitud pendiente de revisión', 'solicitud', ?)`,
        [supervisor.id, result.insertId]
      );
    }

    // Auditoría
    await connection.query(
      `INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, detalles)
       VALUES (?, 'crear_solicitud', 'solicitudes', ?, ?)`,
      [req.user.id, result.insertId, JSON.stringify({ tipo_solicitud_id, dias_solicitados })]
    );

    await connection.commit();

    res.status(201).json({ 
      message: 'Solicitud creada exitosamente',
      id: result.insertId
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error al crear solicitud: ' + error.message });
  } finally {
    connection.release();
  }
});

// Cancelar solicitud
app.delete('/api/solicitudes/:id', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const solicitudId = req.params.id;

    // Verificar que la solicitud pertenece al usuario
    const [solicitudes] = await connection.query(
      `SELECT * FROM solicitudes WHERE id = ? AND usuario_id = ? AND estado = 'pendiente'`,
      [solicitudId, req.user.id]
    );

    if (solicitudes.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Solicitud no encontrada o no se puede cancelar' });
    }

    const solicitud = solicitudes[0];

    // Actualizar solicitud
    await connection.query(
      `UPDATE solicitudes SET estado = 'cancelada' WHERE id = ?`,
      [solicitudId]
    );

    // Devolver días pendientes
    const anio = new Date(solicitud.fecha_inicio).getFullYear();
    await connection.query(
      `UPDATE saldos_dias 
       SET dias_pendientes = dias_pendientes - ?
       WHERE usuario_id = ? AND tipo_solicitud_id = ? AND anio = ?`,
      [solicitud.dias_solicitados, req.user.id, solicitud.tipo_solicitud_id, anio]
    );

    // Auditoría
    await connection.query(
      `INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id)
       VALUES (?, 'cancelar_solicitud', 'solicitudes', ?)`,
      [req.user.id, solicitudId]
    );

    await connection.commit();

    res.json({ message: 'Solicitud cancelada exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al cancelar solicitud:', error);
    res.status(500).json({ error: 'Error al cancelar solicitud' });
  } finally {
    connection.release();
  }
});

// ============================================
// RUTAS DE SALDOS - MEJORADAS
// ============================================

app.get('/api/saldos', authenticateToken, async (req, res) => {
  try {
    const anio = req.query.anio || new Date().getFullYear();

    // Obtener o crear saldos para el usuario
    const [usuario] = await pool.query(
      `SELECT u.tipo_empleado_id, te.dias_vacaciones_anuales, te.dias_permiso_mensual
       FROM usuarios u
       JOIN tipos_empleado te ON u.tipo_empleado_id = te.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar y crear saldos si no existen
    const diasConfig = [
      { id: 1, dias: usuario[0].dias_vacaciones_anuales }, // Vacaciones
      { id: 2, dias: usuario[0].dias_permiso_mensual * 12 }, // Permisos
      { id: 3, dias: 30 }, // Licencia Médica
      { id: 4, dias: 10 }  // Licencia Familiar
    ];

    for (const config of diasConfig) {
      await pool.query(
        `INSERT INTO saldos_dias (usuario_id, tipo_solicitud_id, anio, dias_totales, dias_usados, dias_pendientes)
         VALUES (?, ?, ?, ?, 0, 0)
         ON DUPLICATE KEY UPDATE dias_totales = ?`,
        [req.user.id, config.id, anio, config.dias, config.dias]
      );
    }

    // Obtener saldos actualizados
    const [saldos] = await pool.query(
      `SELECT 
        sd.id,
        sd.usuario_id,
        ts.nombre AS tipo_solicitud,
        ts.color_hex,
        sd.anio,
        sd.dias_totales,
        sd.dias_usados,
        sd.dias_pendientes,
        sd.dias_disponibles
       FROM saldos_dias sd
       JOIN tipos_solicitud ts ON sd.tipo_solicitud_id = ts.id
       WHERE sd.usuario_id = ? AND sd.anio = ?
       ORDER BY ts.id`,
      [req.user.id, anio]
    );

    res.json(saldos);

  } catch (error) {
    console.error('Error al obtener saldos:', error);
    res.status(500).json({ error: 'Error al obtener saldos' });
  }
});

// ============================================
// RUTAS DE NOTIFICACIONES
// ============================================

app.get('/api/notificaciones', authenticateToken, async (req, res) => {
  try {
    const [notificaciones] = await pool.query(
      `SELECT * FROM notificaciones 
       WHERE usuario_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id]
    );

    res.json(notificaciones);

  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// Marcar notificación como leída
app.put('/api/notificaciones/:id/leer', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      `UPDATE notificaciones SET leida = TRUE WHERE id = ? AND usuario_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json({ message: 'Notificación marcada como leída' });

  } catch (error) {
    console.error('Error al actualizar notificación:', error);
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
});

// Marcar todas como leídas
app.put('/api/notificaciones/leer-todas', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      `UPDATE notificaciones SET leida = TRUE WHERE usuario_id = ? AND leida = FALSE`,
      [req.user.id]
    );

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });

  } catch (error) {
    console.error('Error al actualizar notificaciones:', error);
    res.status(500).json({ error: 'Error al actualizar notificaciones' });
  }
});

// ============================================
// RUTAS DE PERFIL
// ============================================

app.get('/api/perfil', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.*, te.nombre as tipo_empleado_nombre, d.nombre as departamento_nombre
       FROM usuarios u
       LEFT JOIN tipos_empleado te ON u.tipo_empleado_id = te.id
       LEFT JOIN departamentos d ON u.departamento_id = d.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];
    delete user.password;

    res.json(user);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// ============================================
// RUTAS DE ADMINISTRACIÓN (NUEVAS)
// ============================================

// Obtener todas las solicitudes (admin/supervisor)
app.get('/api/admin/solicitudes', authenticateToken, async (req, res) => {
  try {
    // Verificar permisos
    const [user] = await pool.query(
      'SELECT es_supervisor, es_rrhh FROM usuarios WHERE id = ?',
      [req.user.id]
    );

    if (!user[0].es_supervisor && !user[0].es_rrhh) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }

    const { estado, desde, hasta } = req.query;
    
    let query = `SELECT * FROM vista_solicitudes_completa WHERE 1=1`;
    let params = [];

    if (estado) {
      query += ` AND estado = ?`;
      params.push(estado);
    }

    if (desde && hasta) {
      query += ` AND fecha_inicio BETWEEN ? AND ?`;
      params.push(desde, hasta);
    }

    query += ` ORDER BY created_at DESC`;

    const [solicitudes] = await pool.query(query, params);
    res.json(solicitudes);

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// Aprobar solicitud (admin/supervisor)
app.put('/api/admin/solicitudes/:id/aprobar', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    // Verificar permisos
    const [user] = await connection.query(
      'SELECT es_supervisor, es_rrhh FROM usuarios WHERE id = ?',
      [req.user.id]
    );

    if (!user[0].es_supervisor && !user[0].es_rrhh) {
      await connection.rollback();
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }

    await connection.beginTransaction();

    const { comentarios } = req.body;
    const solicitudId = req.params.id;

    // Usar el procedimiento almacenado
    await connection.query(
      'CALL aprobar_solicitud(?, ?, ?)',
      [solicitudId, req.user.id, comentarios || '']
    );

    await connection.commit();

    res.json({ message: 'Solicitud aprobada exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al aprobar solicitud:', error);
    res.status(500).json({ error: 'Error al aprobar solicitud' });
  } finally {
    connection.release();
  }
});

// Rechazar solicitud (admin/supervisor)
app.put('/api/admin/solicitudes/:id/rechazar', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    // Verificar permisos
    const [user] = await connection.query(
      'SELECT es_supervisor, es_rrhh FROM usuarios WHERE id = ?',
      [req.user.id]
    );

    if (!user[0].es_supervisor && !user[0].es_rrhh) {
      await connection.rollback();
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }

    await connection.beginTransaction();

    const { comentarios } = req.body;
    const solicitudId = req.params.id;

    // Obtener datos de la solicitud
    const [solicitudes] = await connection.query(
      'SELECT * FROM solicitudes WHERE id = ?',
      [solicitudId]
    );

    if (solicitudes.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    const solicitud = solicitudes[0];

    // Actualizar solicitud
    await connection.query(
      `UPDATE solicitudes 
       SET estado = 'rechazada',
           aprobado_por = ?,
           fecha_aprobacion = NOW(),
           comentarios_aprobador = ?
       WHERE id = ?`,
      [req.user.id, comentarios || 'Solicitud rechazada', solicitudId]
    );

    // Devolver días pendientes
    const anio = new Date(solicitud.fecha_inicio).getFullYear();
    await connection.query(
      `UPDATE saldos_dias 
       SET dias_pendientes = dias_pendientes - ?
       WHERE usuario_id = ? AND tipo_solicitud_id = ? AND anio = ?`,
      [solicitud.dias_solicitados, solicitud.usuario_id, solicitud.tipo_solicitud_id, anio]
    );

    // Crear notificación
    await connection.query(
      `INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, solicitud_id)
       VALUES (?, 'Solicitud Rechazada', ?, 'rechazo', ?)`,
      [solicitud.usuario_id, `Tu solicitud ha sido rechazada. Motivo: ${comentarios || 'No especificado'}`, solicitudId]
    );

    await connection.commit();

    res.json({ message: 'Solicitud rechazada exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({ error: 'Error al rechazar solicitud' });
  } finally {
    connection.release();
  }
});

// ============================================
// RUTA PARA CALENDARIO COMPARTIDO (NUEVO)
// ============================================

app.get('/api/calendario/ausencias', authenticateToken, async (req, res) => {
  try {
    const { mes, anio, departamento } = req.query;
    
    let query = `
      SELECT 
        s.id,
        s.usuario_id,
        u.nombre_completo as empleado,
        ts.nombre as tipo,
        ts.color_hex as color,
        s.fecha_inicio as fechaInicio,
        s.fecha_fin as fechaFin,
        d.nombre as departamento
      FROM solicitudes s
      JOIN usuarios u ON s.usuario_id = u.id
      JOIN tipos_solicitud ts ON s.tipo_solicitud_id = ts.id
      LEFT JOIN departamentos d ON u.departamento_id = d.id
      WHERE s.estado = 'aprobada'
    `;
    
    let params = [];

    // Filtrar por mes/año si se proporciona
    if (mes && anio) {
      query += ` AND (
        (YEAR(s.fecha_inicio) = ? AND MONTH(s.fecha_inicio) = ?) OR
        (YEAR(s.fecha_fin) = ? AND MONTH(s.fecha_fin) = ?) OR
        (s.fecha_inicio <= ? AND s.fecha_fin >= ?)
      )`;
      const primerDia = `${anio}-${String(mes).padStart(2, '0')}-01`;
      const ultimoDia = new Date(anio, mes, 0);
      const ultimoDiaStr = `${anio}-${String(mes).padStart(2, '0')}-${ultimoDia.getDate()}`;
      params.push(anio, mes, anio, mes, ultimoDiaStr, primerDia);
    }

    // Filtrar por departamento si se proporciona
    if (departamento && departamento !== 'todos') {
      query += ` AND d.nombre = ?`;
      params.push(departamento);
    }

    query += ` ORDER BY s.fecha_inicio`;

    const [ausencias] = await pool.query(query, params);
    res.json(ausencias);

  } catch (error) {
    console.error('Error al obtener ausencias:', error);
    res.status(500).json({ error: 'Error al obtener ausencias del calendario' });
  }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Base de datos: ${dbConfig.database}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
  process.exit(1);
});