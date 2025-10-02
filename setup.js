// setup.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'CRUD';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'elolia';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lindas';

const SQL_FILE = path.join(__dirname, 'database.sql');

async function run() {
  try {
    const sql = fs.readFileSync(SQL_FILE, 'utf8');

    // Primeiro conecta sem especificar banco (para garantir que CREATE DATABASE funcione)
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true
    });

    console.log('Executando database.sql ...');
    await conn.query(sql);
    await conn.end();
    console.log('Schema executado/atualizado com sucesso.');

    // Agora conecta ao banco específico para inserir admin
    const db = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    // Checa se já existe usuário com esse username
    const [rows] = await db.execute('SELECT id, role FROM users WHERE username = ?', [ADMIN_USERNAME]);

    if (rows.length > 0) {
      console.log(`Usuário "${ADMIN_USERNAME}" já existe (id=${rows[0].id}, role=${rows[0].role}). Nenhuma ação tomada.`);
    } else {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

      const [result] = await db.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [ADMIN_USERNAME, hashed, 'admin']
      );

      console.log(`Admin "${ADMIN_USERNAME}" criado com sucesso (id=${result.insertId}).`);
    }

    await db.end();
    console.log('Setup concluído.');
  } catch (err) {
    console.error('Erro durante setup:', err.message || err);
    process.exit(1);
  }
}

run();
