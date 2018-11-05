var mysql = require('mysql');
const util = require('util');

const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'agiler'
};

var connection = mysql.createConnection(config);

let isConnected = false;
let retryTimes = 0;
const retryTimeout = 10000;

function connect(cb) {
    if(isConnected) {
        cb(null, connection);
        return;
    }

    connection.connect(err => {
        retryTimes++;
        if(err) {
            if(retryTimes >= 10) {
                console.log(`Connecting to MySQL Failed ${retryTimes} times. Stopping`);
                cb(err);
            } else {
                console.log(`Connecting to MySQL Failed ${retryTimes} times. Retrying in ${retryTimeout}ms`);
                setTimeout(connect.bind(this, cb), retryTimeout);
            }
        } else {
            isConnected = true;
            console.log(`Connected to MySQL on ${retryTimes} attempt.`);
            cb(null, connection);
        }
    });
}

module.exports = util.promisify(connect);

// connection.query('SELECT 4', (err, res) => {
//     if(err) { console.log('Query Failed'); }
//     else { console.log('Connection Successful'); }
//     console.log(res[0]);
// });
