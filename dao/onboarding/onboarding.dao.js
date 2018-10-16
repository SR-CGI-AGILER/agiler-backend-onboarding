const dbConnection = require('../../db-connection/mysql');
const uuidv4 = require('uuid/v4');

function addRecord(email,name,profilePicUrl){
    return new Promise((resolve,reject)=>{
        let id = uuidv4();
        let newUserRecord = {id:id, name:name, email:email, profilePic:profilePicUrl};
        let query = dbConnection.connection.query('INSERT INTO user SET ?',
        newUserRecord, (error, results, fields)=>{
            if(error) throw error;
        }) 
    });
}


module.exports = {
    addRecord
}