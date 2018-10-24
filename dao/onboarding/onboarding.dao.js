const dbConnection = require('../../db-connection/mysql');
const uuidv4 = require('uuid/v4');

function findRecord(data){
    console.log(data);
    return new Promise((resolve,reject)=>{
        dbConnection.connection.query(`SELECT * from user where id="${data.userid}"`, (error, results, fields)=>{
            console.log(results[0]);
            if(error) {
                reject(error);
            }
            else{
                if(results[0])
                    resolve(results[0]);
                else
                    resolve(false);
            }
        });
        
    });
}

function findAllUsers(){
    return new Promise((resolve, reject)=>{
        dbConnection.connection.query(`SELECT * from user`,(error, results, fields)=>{
            if(error){
                reject(error);
            }
            else{
                if(results)
                    resolve(results);
                else
                    resolve(false);
            }
        });
    });
}

function findTeam(data){
    return new Promise((resolve,reject)=>{
        dbConnection.connection.query(`SELECT * from team where teamId="${data.teamId}"`, (error, results, fields)=>{
            console.log(results[0]);
            if(error) {
                reject(error);
            }
            else{
                if(results[0]){
                    const length = results.length;
                    resolve({
                        length: length,
                        results: results
                    })
                    
                }
                    
                else
                    resolve(false);
            }
        });
    });
}

function findTeamMembers(data){
    return new Promise((resolve, reject)=>{
        dbConnection.connection.query(`select user.name, user.email, team.memberId from user, team where teamId="${data.teamId}" AND user.id=team.memberId`,
                    (error, results,fields)=>{
                        if(error){
                            reject(error);
                        }
                        else{
                            if(results[0]){
                                const length = results.length;
                                resolve({
                                    length: length,
                                    results: results
                                });
                            }

                            else
                                resolve(false);
                        }
                    })
    })
}

function checkUser(email){
    // console.log(email,"in check User")
    return new Promise(function (resolve, reject ) {

        dbConnection.connection.query(`SELECT * from user where email="${email}"`,
                (error,results, fields)=>{
                    //console.log(error,results);
                    // console.log(results[0]);
                    if(error) {
                        //console.log(error)
                        reject(error);
                    }
                    else if(results[0]){
                        // console.log("blabla", results[0])
                        // return results;
                        resolve({
                            status: true ,
                            existionUserData: results[0]
                        });
                    }
                    else{
                        // console.log("I dont wnat to be here")
                        resolve("false");
                    }
                })
    })
}

function getUserId(data){
    let email = data.email;
    return new Promise((resolve,reject)=>{
        dbConnection.connection.query(`SELECT id from user where email="${email}"`,
        (error,results, fields)=>{
            if(error){
                reject(error)
            }
            else{
                resolve(results[0]);
            }
        });
    });
}

function addRecord(name,email,profilePicUrl,jwtToken){
    // console.log(email,"IN add record");
    return new Promise((resolve,reject)=>{
        //console.log(email,"addRecordDAO");
        // console.log(checkUser(email),"sdfdsf");
        checkUser(email).then(data=>{
            // console.log(data)
            let sessionRecord = {id:uuidv4(), jwtToken: jwtToken };
            let sessionQuery = dbConnection.connection.query('INSERT INTO session SET ?',
            sessionRecord, (error, results, fields)=>{
                if(error){
                    console.log(error);
                    reject(error)
                }
            });
            if(data.status  === true){
                // console.log('Already Exists');
                resolve({msg: 'Already', user: data.existionUserData});
            }
            else{
                let id = uuidv4();
                // console.log(id,"this is inside else llolop of addrecord DAO");

                let newUserRecord = {id:id, name:name, email:email, profilePicUrl:profilePicUrl};
                let query = dbConnection.connection.query('INSERT INTO user SET ?',
                newUserRecord, (error, results, fields)=>{
                    if(error) {
                        console.log(error);
                        reject(error)
                    }
                    else {
                        // console.log('Added');
                        resolve({msg: 'OK', user: newUserRecord})
                    }
                });
            }
        })
    });
}


module.exports = {
    addRecord,
    findRecord,
    findTeam,
    findTeamMembers,
    findAllUsers,
    getUserId
}