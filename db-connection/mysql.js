var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'agiler'
});

connection.connect();

module.exports = {
    connection
}
