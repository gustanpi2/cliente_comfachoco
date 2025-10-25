// backend/updatePasswords.js
// Script para actualizar las contraseñas de los usuarios en la BD

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updatePasswords() {
  let connection;
  
  try {
    console.log('\n🔐 Actualizando contraseñas en la base de datos...\n');

    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'comfachoco_portal'
    });

    console.log('✅ Conectado a MySQL\n');

    // La contraseña que queremos usar
    const passwordPlain = 'admin123';
    
    // Generar hash con bcrypt
    console.log('🔄 Generando hash para la contraseña: admin123');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);
    console.log(`📝 Hash generado: ${passwordHash.substring(0, 30)}...\n`);

    // Obtener todos los usuarios
    const [usuarios] = await connection.query('SELECT id, email, nombre_completo FROM usuarios');
    
    console.log(`👥 Actualizando ${usuarios.length} usuarios:\n`);

    // Actualizar cada usuario
    for (const usuario of usuarios) {
      await connection.query(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [passwordHash, usuario.id]
      );
      console.log(`   ✅ ${usuario.email} - ${usuario.nombre_completo}`);
    }

    console.log('\n🎉 ¡Contraseñas actualizadas exitosamente!\n');
    console.log('📋 Credenciales para login:');
    console.log('   Contraseña para TODOS los usuarios: admin123\n');
    console.log('   Usuarios disponibles:');
    usuarios.forEach(u => {
      console.log(`   📧 ${u.email}`);
    });
    console.log('');

    // Verificar que funciona
    console.log('🧪 Verificando hash...');
    const isValid = await bcrypt.compare(passwordPlain, passwordHash);
    console.log(`   ¿El hash es válido?: ${isValid ? '✅ Sí' : '❌ No'}\n`);

    await connection.end();
    console.log('✨ ¡Proceso completado! Ahora puedes hacer login.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Código:', error.code);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar
updatePasswords();

/*
INSTRUCCIONES:
==============
1. Asegúrate de estar en la carpeta backend/
2. Ejecuta: node updatePasswords.js
3. Espera a que termine
4. Intenta hacer login con:
   - Email: maria.gonzalez@comfachoco.com
   - Password: admin123
*/