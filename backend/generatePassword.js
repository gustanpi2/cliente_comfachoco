// backend/generatePassword.js
// Script para generar hashes de contraseñas bcrypt
// Útil para crear nuevos usuarios o resetear contraseñas

const bcrypt = require('bcryptjs');

// Función para generar hash
async function generateHash(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error al generar hash:', error);
    return null;
  }
}

// Función principal
async function main() {
  const passwords = [
    'admin123',
    'empleado123',
    'supervisor123'
  ];

  console.log('🔐 Generando hashes de contraseñas...\n');
  
  for (const password of passwords) {
    const hash = await generateHash(password);
    console.log(`Contraseña: ${password}`);
    console.log(`Hash: ${hash}\n`);
  }

  // Verificar que funciona
  console.log('✅ Verificando hash...');
  const testHash = await generateHash('admin123');
  const isValid = await bcrypt.compare('admin123', testHash);
  console.log(`¿La contraseña coincide?: ${isValid ? 'Sí ✅' : 'No ❌'}\n`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { generateHash };

// INSTRUCCIONES DE USO:
// 1. Asegúrate de estar en la carpeta backend/
// 2. Ejecuta: node generatePassword.js
// 3. Copia el hash generado
// 4. Úsalo en tus INSERT de MySQL