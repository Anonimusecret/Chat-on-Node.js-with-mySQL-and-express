const res = require("express/lib/response.js");

const testButton = document.getElementById("sign-in");
testButton.addEventListener('click', () => login(this.userLogin, this.userPassword), false);


function redirect(){
    let url = 'https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage'
    if(true){
        location.href="./login.html"
    }
}

async function login(login, pass){
    let sql = `SELECT * FROM users WHERE login = ${login}`
    let user;

    connection.query(sql, function(err, results){
        if(err) console.log(err);
        user = results;
    })

    let response = await fetch('/user', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });

    let result = await response.json();
    
    console.log(result)

    if (user){
        if( user[0].password == pass){
            console.log(`autorized ${login}`)
        }
    } else {
        console.log('не найдено')
    }
}