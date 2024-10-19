const mysql = require("mysql2");
const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const http = require('http');
const app = express()
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const port = 3000

app.set('view engine', 'pug')
app.set('views', './frontend');
app.use(express.static('frontend'))
app.use(bodyParser.json())
app.use(express.static('backend'))
app.use(session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: true
}))
app.use(express.static('/frontend/assets/dist/css'))
app.use(express.static('./frontend/chat.css'))

io.on('connection', (socket) => {
    console.log(`User connected on ` + socket);
    let room;

    socket.on('join chat',  body  => {
        room = body.room

        socket.join(room)
        //socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        //io.in(room).emit('users', getUsers(room))

    })
    
    socket.on('sendMessage', input => {


        io.in(room).emit('message', input); 
    })



});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

const authCheck = function(req, res, next){
    if(!req.session.autorized){
        res.redirect('/login.html')
        return
    }
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
                    }
                )
            }
        }
    )
})

app.post('/login', (req, res) => {

    let userLogin = req.body.login
    let userPassword = req.body.password

    pool.query(
        `SELECT * FROM users WHERE login = ?`,
        userLogin,
        (error, result) => {
            if (error) throw error;
            
            if(result.length == 0){
                console.log('пользователь не найден');
                req.session.autorized = false;

            }else{
                let user = result[0]
                console.log(result);
                if(user.password == userPassword){
                    console.log('авторизовано');
                    req.session.autorized = true;
                    req.session.uid = user.uid
                    req.session.login = user.login
                    req.session.acces = user.acces 
                    
                }else{
                    console.log('пароль неверный');
                    req.session.autorized = false;
                    
                }
            }
            res.send(req.session);
        }
    )
})

app.get("/", function(req, res) {
    console.log('запрос от /')
    res.redirect('/login.html')
})

app.use(authCheck)

app.get('/logout', (req,res) => {
    req.session.destroy(function(){
        res.redirect('/login.html');
    });
})

app.post('/main', (req, res) => {
    let answer = {autorized: true}
    res.send(answer)
})

app.get('/chatsMain', (req, res) => {
    console.log(req.session.uid)
    pool.query(
        `SELECT * FROM chats WHERE chatid IN (SELECT chatid FROM chat_members WHERE uid = ${req.session.uid})`,
        (error, result) =>  {
            if(error) throw error;

            res.send(result)
    })
})

app.post('/createChat', (req, res) => {
    let chatid;
    let chatname = req.body.name;
    pool.query(
        'INSERT INTO chats(name) VALUES (?)',
        req.body.name,
        (error, result) =>  {
            if(error) throw error;
            chatid = result.insertId;
            
            pool.query(
                `INSERT INTO chat_members(chatid, uid) VALUES (${chatid},?)`,
                req.session.uid,
                (error, result) =>  {
                    if(error) throw error;
                    res.send({chatid: chatid, chatname: chatname})
            })
    })

    
})

app.post('/chat/:chatroomid', (req, res) => {
    let chatroomid = req.params.chatroomid
    pool.query(
        'SELECT * FROM messages where chatid = ? ORDER BY msgid',
        chatroomid,
        (error, result) =>  {
            if(error) throw error;
            res.send(result)
    })
})

app.put('/chat/:chatroomid', (req, res) => {
    let chatroomid = req.params.chatroomid
    let input = {uid: req.session.uid || 1, chatid: chatroomid, message: req.body.message}
    req.body.uid = req.session.uid
    pool.query(
        'INSERT INTO messages SET ?',
        input,
        (error, result) =>  {
            if(error) throw error;
            res.send({result})
    })
})



app.get('/chat/:chatroomid', (req, res) => {

    let chatroomid = req.params.chatroomid
    req.body.uid = req.session.uid
    pool.query(
        'SELECT * FROM messages where chatid = ? ORDER BY msgid',
        chatroomid,
        (error, result) =>  {
            if(error) throw error;
            
            //res.send(result)
            res.render('chat.pug', { title: chatroomid, user: req.session.uid })

    })
    //res.redirect('/chat.html')
})

app.put('/invite/:chatroomid', (req, res) =>{
    let newMember = {chatid: req.params.chatroomid}

    pool.query(
        'SELECT * FROM users where login = ?',
        req.body.user,
        (error, result) => {
            if(error) throw error;
            console.log('inviting user ' + result[0].login)
            newMember.uid = result[0].uid

            pool.query(
                'INSERT INTO chat_members SET ?',
                newMember,
                (error, result) => {
                    if(error) throw error;
        
                    res.send(result)
                }
            )
        }
    )

    
})

app.get('/chat_members/:chatroomid', (req, res) =>{
    let chatroomid = req.params.chatroomid;
    //let chat_members = '';

    pool.query(
        'SELECT uid FROM chat_members WHERE chatid = ?',
        chatroomid,
        (error, result) => {
            if(error) throw error;

            let userIds = result.map((x) => x.uid)

            pool.query(
                `SELECT uid, login FROM users WHERE uid IN (${userIds})`,
                (error, result) => {
                    if(error) throw error;
                    res.send(result)
                }
            )
        }
    )

    
})


app.get('/users/this', (req, res) => {

    res.send(req.session);

})

app.get('/users/all', (req, res) => {

    if(req.session.acces == 2){

        pool.query(
            'SELECT uid, login FROM users',
            (error, result) =>  {
                if(error) throw error;
                
                res.send(result);
        })
        
    }

    
})

app.get('/profile', (req, res) => {
    let acces;
    if(req.session.acces == 1){
        acces = 'Пользователь'
    }else{
        acces = 'Администратор'
    }
    res.render('profile.pug', {username: req.session.login, acces: acces})
})

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "testchat",
    password: "Darkness",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, 
    idleTimeout: 60000, 
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});



pool.query(
    'SELECT * FROM `acces`',
    function (err, results, fields) {
        console.log(results);
        console.log(fields); 
    }
);

