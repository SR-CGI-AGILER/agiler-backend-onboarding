const dbConnection = require('../../db-connection/mysql');
const uuidv4 = require('uuid/v4');

function findRecord(name){
    return new Promise((resolve,reject)=>{
        let query = dbConnection.connection.query('')
    })
}

function addRecord(name,email,profilePicUrl){
    return new Promise((resolve,reject)=>{
        console.log(email,"addRecordDAO");
        let id = uuidv4();
        console.log(id);
        let newUserRecord = {id:id, name:name, email:email, profilePicUrl:profilePicUrl};
        let query = dbConnection.connection.query('INSERT INTO user SET ?',
        newUserRecord, (error, results, fields)=>{
            if(error) {
                reject(error)
            }
            else {
                resolve('OK')
            }
        })
        console.log('after query execution'); 
    });
}


module.exports = {
    addRecord
}