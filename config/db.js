const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'crud',
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao MySQL.');
});

module.exports = connection;
