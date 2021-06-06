//db 수정해야
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: '',
    user: 'root',
    password: '0000',
    database: '',
});

db.connect();

module.exports = db;