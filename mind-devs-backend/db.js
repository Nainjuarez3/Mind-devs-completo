const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Probamos la conexión al iniciar
pool.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión a la BD', err.stack);
    } else {
        console.log('✅ Conexión exitosa a PostgreSQL');
    }
});

module.exports = pool;