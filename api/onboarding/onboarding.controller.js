const onboardingDao = require('../../dao/onboarding/onboarding.dao');
const request = require('superagent');
const keys = require('../../config/keys');

const waterfall = require('async/waterfall');
const async = require('async')

function def(req, res){
    async.waterfall([
        async.apply(getGoogleToken, req, res),
        getGoogleUserData,
        saveData,
        async.apply(sendResponse, res)
    ], function(err, results){

    });
}

function getGoogleToken(req, res, cb){
    request
    .post('https://www.googleapis.com/oauth2/v3/token')
    .set({
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    })
    .send({
      'code': req.body.code,
      'redirect_uri': 'http://localhost:4200/torii/redirect.html',
      'client_id': keys.google.clientID,
      'client_secret': keys.google.clientSecret,
      'grant_type': 'authorization_code',
      'scope': '',

    }).then(data => {
        if(data.access_token){
            return cb(null, data);
        }
        else{
            res.status().send({
                payload: {
                    msg:'Unauthorized'
                }
            })
        }
    })
}

function getGoogleUserData(data ,cb){
    let access_token = data.access_token;
    if(access_token){
        request
        .get(`https://api.github.com/user`)
        .set({
            'Authorization': `token ${access_token}`
        })
        .send({
        })
        .then(data=>{
            if(data.statusCode === 200){
                return cb(null, data);
            }
            else{
                res.status('401').send({
                    payload:{
                        msg:'Unauthorized'
                    }
                })
            }
        })
    }
}

// function getGoogleToken(req, res){
//     request
//      .post('https://www.googleapis.com/oauth2/v3/token')
//      .set({
//        'Content-Type': 'application/x-www-form-urlencoded',
//        'X-Requested-With': 'XMLHttpRequest'
//      })
//      .send({
//        'code': req.body.code,
//        'redirect_uri': 'http://localhost:4200/torii/redirect.html',
//        'client_id': keys.google.clientID,
//        'client_secret': keys.google.clientSecret,
//        'grant_type': 'authorization_code',
//        'scope': '',

//      }).then(data => {
//         if(data.access_token){
//             request
//                 .post('https://www.googleapis.com/oauth2/v2/userinfo')
//                 .set({
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                     'X-Requested-With': 'XMLHttpRequest',
//                     'Authorization': `Bearer ${data.access_token}`
//                 })
//         }
       
//      }).then(data =>{
        
//         res.send(JSON.parse(data.text))
//      })
// }

function abc(req, res){
    async.waterfall([
        async.apply(getGithubToken, req, res),
        getUserData,
        saveData,
        async.apply(sendResponse, res)
    ], function(err, results){

    });
}

function getGithubToken(req, res,cb){
    console.log('here in get github')
    request
     .post('https://github.com/login/oauth/access_token')
     .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'  
     })
     .send({
        'code': req.query.code,
        'redirect_uri': 'http://localhost:4200/torii/redirect.html',
        'client_id': keys.github.clientID,
        'client_secret': keys.github.clientSecret,
        'grant_type': 'authorization_code',
        'scope': '',
     }).then(data => {
        //  console.log(data.statusCode);
        if(JSON.parse(data.text).access_token)
            return cb(null, data);
        else{
            res.status('401').send({
                payload: {
                    msg: 'Unauthorized'
                }
            });
        }
     })

}

function getUserData(data, cb){
    //.then(data => {
    let access_token = JSON.parse(data.text).access_token;     
    console.log(access_token, "get User DAATA funtion ")
    if(access_token){
        //console.log("dadasd")
        request
        .get(`https://api.github.com/user`)
        .set({
            'Authorization': `token ${access_token}`
        })
        .send({
            // 'access_token': JSON.parse(data.text).access_token
        }).then(data,access_token=>{
            // console.log(typeof data.statusCode);
            if(JSON.parse(data.statusCode === 200)){
                return cb(null, data, access_token)
            }
            else{
                res.status('401').send({
                    
                    payload: {
                        msg: 'Unauthorized'
                    }
                });
            }
        })
    }
}
    
function saveData(data, cb){
    console.log(JSON.parse(data.text).name, 'in save data')
    let userdata = JSON.parse(data.text);
    //console.log(userdata);
    onboardingDao.addRecord(userdata.name,userdata.email,userdata.avatar_url)
        .then(data =>{
            if(data === 'OK')
                return cb(null, data);
            else{
                res.status('401').send({
                    
                    payload: {
                        msg: 'Unauthorized'
                    }
                });
            }
        })
}
    
function sendResponse(res, data, cb){
    res.send(data);
    cb(null)
}
    // .then(data => {
    //             console.log(JSON.parse(data.text).name)
    //         })
    //      }
         
    //  })


module.exports = {
    getGoogleToken,
    abc
}