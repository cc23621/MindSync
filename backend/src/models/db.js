const { Pool } = require('pg');
require('dotenv').config();

console.log("Conectando com:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Neon exige SSL
});

pool.connect()
  .then(() => console.log("Conectado ao Neon!"))
  .catch(err => console.error("Erro ao conectar no Neon:", err));

module.exports = pool;
