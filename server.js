const mysql = require("mysql2");
const express = require('express');
const bodyParser = require('body-parser')
//const pool = require('../backend/pool.js')
const session = require('express-session')

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

app.use(requestTime)

app.post('/users', (req, res) => {

    pool.query(
        `INSERT INTO users SET ?`,
        req.body,
        (error, result) => {
            if (error) throw error;
            res.send(`User added with ID: ${result.insertId}`);
        }
    )
    //res.send('smthng')

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
                    req.session.acces = result[0].acces
                    //res.redirect("https://metanit.com")
                    //res.redirect('main.html');
                }else{
                    console.log('пароль неверный');
                }
            }else{
                console.log('пользователь не найден');
                //res.send(result);
            }
            
        }
    )
    //res.send('smthng')
    res.redirect("main")
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