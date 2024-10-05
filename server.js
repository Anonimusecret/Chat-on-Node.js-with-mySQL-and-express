const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "testchat",
    password: "Darkness"
});

// тестирование подключения
connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

connection.query(
    'SELECT * FROM `acces`',
    function (err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    }
);

 // закрытие подключения
connection.end(function(err) {
if (err) {
    return console.log("Ошибка: " + err.message);
}
console.log("Подключение закрыто");
});