//db 수정해야
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "", //
    user: "", //
    password: "", //
    database: "", //
});

db.connect();

module.exports = db;