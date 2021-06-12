const mysql = require("mysql2");

let db =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'powerg', //데이터베이스 미리 생성해놔야함
});

db.connect(function (err) {
    if (err) {
        return console.error(err.message);
    }

    let query1 = 'use powerg;'
    let query2 = 'create table if not exists users(id varchar(10), name varchar(10), pw varchar(10));';
    let query3='insert into users (id,name,pw) select \'developer\', \'dev\', \'7777\' from dual where not exists (select * from users where id=\'developer\' and name=\'dev\' and pw=\'7777\');';


    db.query(query1, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
    });
    db.query(query2, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
    });
     db.query(query3, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
    });

});

module.exports = db;
