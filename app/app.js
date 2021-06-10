"use strict";
// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
// const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');

const app = express();
var port = 3000;
app.listen(port, function(){
	console.log('server on! http://localhost:'+port);
});

// 라우팅
const home = require("./src/routes/home");

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs"); 

app.use(express.static(`${__dirname}/src/views`)); //dirname은 app.js가 현재 있는 dir, 프런트 html과 연결됨
app.use(express.static(`${__dirname}/src/public`)); //dirname은 app.js가 현재 있는 dir, 프런트 html과 연결됨
app.use(express.static(`${__dirname}/build`));
app.use(bodyParser.json()); //body-parser을 사용함으로써, 디폴트값인 undefined대신 아이디와 비밀번호를 받아올수있음.

// 세션
app.use(session({
    secret: 'powerg', // 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore() // 세션이 데이터를 저장하는 곳
}));

// app.use(session({
//     secret: 'powerg', // 데이터를 암호화 하기 위해 필요한 옵션
//     resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
//     saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
//     store : new MySQLStore({
//         host: "login-totooppa.c1wfzymzbbhq.ap-northeast-2.rds.amazonaws.com",
//         port: 3306,
//         user: "admin",
//         password: "",
//         database: "login_totooppa",
//     }) 
// }));

// URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded({ extended: true}));
app.use("/", home); //use -> 미들 웨어를 등록해주는 메소드.

module.exports = app;
