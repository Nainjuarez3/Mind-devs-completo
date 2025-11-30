const { Pool } = require('pg');
require('dotenv').config();

// Detectamos si estamos en Producción (Render tiene una variable DATABASE_URL)
const isProduction = !!process.env.DATABASE_URL;

const connectionConfig = isProduction
  ? {
      // CONFIGURACIÓN PARA RENDER (NUBE)
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Esto es obligatorio para que Render acepte la conexión
      }
    }
  : {
      // CONFIGURACIÓN PARA TU COMPUTADORA (LOCAL)
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    };

const pool = new Pool(connectionConfig);

pool.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la BD:', err.message);
  } else {
    console.log('✅ Conexión exitosa a PostgreSQL (' + (isProduction ? 'Nube' : 'Local') + ')');
  }
});

module.exports = pool;