// backend/test_connection.js
// Script para probar la conexión a MySQL

const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('\n🔍 Probando conexión a MySQL...\n');
  console.log('📋 Configuración actual:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   User: ${process.env.DB_USER || 'root'}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : '(vacío)'}`);
  console.log(`   Database: ${process.env.DB_NAME || 'comfachoco_portal'}`);
  console.log('');

  try {
    // Intentar conexión
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'comfachoco_portal'
    });

    console.log('✅ ¡Conexión exitosa a MySQL!\n');

    // Probar consultas
    console.log('📊 Verificando base de datos...');
    
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`   Tablas encontradas: ${tables.length}`);
    
    const [usuarios] = await connection.query('SELECT COUNT(*) as total FROM usuarios');
    console.log(`   Usuarios en BD: ${usuarios[0].total}`);
    
    const [tipos] = await connection.query('SELECT COUNT(*) as total FROM tipos_solicitud');
    console.log(`   Tipos de solicitud: ${tipos[0].total}`);
    
    const [saldos] = await connection.query('SELECT COUNT(*) as total FROM saldos_dias');
    console.log(`   Registros de saldos: ${saldos[0].total}`);

    console.log('\n🎉 ¡Todo está funcionando correctamente!\n');

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error de conexión:\n');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔐 ACCESO DENEGADO');
      console.error('   La contraseña es incorrecta o el usuario no tiene permisos.\n');
      console.error('💡 Soluciones:');
      console.error('   1. Verifica la contraseña en el archivo .env');
      console.error('   2. Usa la misma contraseña que usas en MySQL Workbench');
      console.error('   3. O crea un nuevo usuario (ver guía)\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🚫 CONEXIÓN RECHAZADA');
      console.error('   MySQL no está corriendo.\n');
      console.error('💡 Solución:');
      console.error('   1. Abre MySQL Workbench e inicia el servidor');
      console.error('   2. O ejecuta: net start MySQL80 (como administrador)\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('📂 BASE DE DATOS NO ENCONTRADA');
      console.error('   La base de datos "comfachoco_portal" no existe.\n');
      console.error('💡 Solución:');
      console.error('   Ejecuta el script SQL de creación en MySQL Workbench\n');
    } else {
      console.error(`   Código: ${error.code}`);
      console.error(`   Mensaje: ${error.message}\n`);
    }

    process.exit(1);
  }
}

// Ejecutar test
testConnection();

/* 
INSTRUCCIONES DE USO:
====================

1. Asegúrate de estar en la carpeta backend/
2. Ejecuta: node test_connection.js
3. Lee los mensajes de error y sigue las soluciones sugeridas
4. Una vez que funcione, el servidor backend debería funcionar también
*/