const mysql = require("mysql2");
const express = require('express');
const bodyParser = require('body-parser')
//const pool = require('../backend/pool.js')
const session = require('express-session')
const path = require('path');
const { console } = require("inspector/promises");

const app = express()
const port = 3000


app.use(express.static('frontend'))
app.use(bodyParser.json())
app.use(express.static('backend'))
app.use(session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: true
}))
app.use(express.static('/frontend/assets/dist/css'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

app.use(requestTime)

app.post('/reg', (req, res) => {

    pool.query(
        'SELECT * FROM users WHERE login = ?',
        req.body.login,
        (error, result) => {
            if(error) throw error;
            if(result.length != 0){
                res.send('{"status": "deny"}')
                console.log('Регистрация отклонена')
            }else{
                console.log('можно вносить')
                let user = {
                    login: req.body.login,
                    password: req.body.password
                }
                pool.query(
                    `INSERT INTO users SET ?`,
                    user,
                    (error, result) => {
                        if (error) throw error;
                        res.send('{"status": "reg"}')
                        console.log(result)
                    }
                )
            }
        }
    )
})

app.post("/", function(req, res) {
    console.log('запрос от /')
    req.session.autorized = true
    res.send(req.session)
})

app.post('/main', (req, res) => {
    let answer = {autorized: true}
    res.send(answer)
})

app.post('/login', (req, res) => {

    let userLogin = req.body.login
    let userPassword = req.body.password

    pool.query(
        `SELECT * FROM users WHERE login = ?`,
        userLogin,
        (error, result) => {
            if (error) throw error;
            if(result.length != 0){
                console.log(result);
                if(result[0].password == userPassword){
                    console.log('авторизовано');
                    req.session.autorized = true;
                    req.session.uid = result[0].uid
                    req.session.login = result[0].login
                    req.session.acces = result[0].acces 
                    
                    //res.redirect("https://metanit.com")
                    res.send(req.session);
                }else{
                    console.log('пароль неверный');
                    req.session.autorized = false;
                    res.send(req.session);
                }
            }else{
                console.log('пользователь не найден');
                req.session.autorized = false;
                res.send(req.session);
            }
            
        }
    )
    //res.send('smthng')
})

app.post('/logout', (req,res) => {
    req.session.destroy(function(){
        res.redirect('/');
    });
})


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "testchat",
    password: "Darkness",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});



// тестирование подключения
//pool.connect(function(err){
//   if (err) {
//      return console.error("Ошибка: " + err.message);
//    }
//    else{
//        console.log("Подключение к серверу MySQL успешно установлено");
//    }
//});

pool.query(
    'SELECT * FROM `acces`',
    function (err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    }
);

// закрытие подключения
//connection.end(function(err) {
//if (err) {
//    return console.log("Ошибка: " + err.message);
//}
//console.log("Подключение закрыто");
//});