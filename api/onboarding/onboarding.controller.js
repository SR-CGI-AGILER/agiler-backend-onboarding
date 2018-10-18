const onboardingDao = require('../../dao/onboarding/onboarding.dao');
const request = require('superagent');
const keys = require('../../config/keys');

const waterfall = require('async/waterfall');
const async = require('async');

function getAllUsers(req, res) {
    let data = {
        userid : req.params.id
    }
    onboardingDao.findRecord(data).then(data => {
        res.status('200').send({
            payload: data
        });
    });
}

function getTeam(req,res){
    let data = {
        teamId: req.params.teamId
    }
    onboardingDao.findTeam(data).then(data=>{
        res.status('200').send({
           payload: {
                length: data.length,
                results: data.results
           }
        })
    })
}

function getTeamMembers(req, res){
    let data = {
        teamId: req.params.teamId        
    }
    onboardingDao.findTeamMembers(data).then(data=>{
        res.status('200').send({
            payload : {
                length: data.length,
                results: data.results
            }
        });
    });
}

function loginWithGoogle(req, res){
    console.log("WATERFALL.............................")
    async.waterfall([
        async.apply(getGoogleToken, req, res),
        getGoogleUserData,
        saveGoogleData,
        async.apply(sendResponse, res)
    ], function(err, results){

    });
}

function getGoogleToken(req, res, cb){
    console.log("inside get google Token")
    request
    .post('https://www.googleapis.com/oauth2/v3/token')
    .set({
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    })
    .send({
      'code': req.body.code,
      'redirect_uri': 'http://localhost:4200/torii/redirect.html',
      'client_id': '1053797418071-cb49noe362osfv37v0jc25bkvqbum5qp.apps.googleusercontent.com',
      'client_secret': '7o6XfydcFK7neYRbOJs2Kuze',
      'grant_type': 'authorization_code',
      'scope': '',

    }).then(data => {
        // console.log(data);
        // console.log(data,"google")
        // console.log(data,"google");
        // res.send(JSON.parse(data.text));
        if(data.body.access_token){
            console.log(data.body.access_token,"access");
            return cb(null, data.body);
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

function getGoogleUserData(tokendata ,cb){
    console.log( "inside getGoogleUserData")
    let access_token = tokendata.access_token;
    // if(true){
        request
        .get(`https://www.googleapis.com/oauth2/v2/userinfo`)
        .set({
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': `Bearer ${access_token}`
        })
        .send({
        })
        .then((data)=>{
            // console.log(err,"aftereturnr getdata");
            if(data.statusCode === 200){
                const obj = Object.assign(tokendata, JSON.parse(data.text));
                return cb(null, obj);
            }
            else{
                res.status('401').send({
                    payload:{
                        msg:'Unauthorized'
                    }
                })
            }
        }).catch(err => { 
            console.log("asdjhajksd", err)
        })
    // }
}

function saveGoogleData(data, cb){
    // console.log(arg2);
    // console.log(JSON.parse(data.text).name, 'in save data')
    // let userdata = JSON.parse(data.text);
    //console.log(userdata);
    onboardingDao.addRecord(data.name,data.email,data.picture)
        .then(newdata =>{
            if(newdata === 'OK')
                return cb(null, data);
            else if(newdata === 'Already'){
                return cb(null, data);
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

function loginWithGithub(req, res){
    async.waterfall([
        async.apply(getGithubToken, req, res),
        getUserData,
        saveData,
        async.apply(sendResponse, res)
    ], function(err, results){

    });
}

function getGithubToken(req, res,cb){
    // console.log('here in get github')
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
            return cb(null, JSON.parse(data.text));
        else{
            res.status('401').send({
                payload: {
                    msg: 'Unauthorized'
                }
            });
        }
     })

}

function getUserData(tokendata, cb){
    //.then(data => {
        //console.log(data);
    // let access_token = tokendata.text).access_token;     
    //console.log(access_token, "get User DAATA funtion ")
    if(tokendata.access_token){
        // console.log("dadasd")
        request
        .get(`https://api.github.com/user`)
        .set({
            'Authorization': `token ${tokendata.access_token}`
        })
        .send({
            // 'access_token': JSON.parse(data.text).access_token
        }).then(data=>{
            // console.log(typeof data.statusCode);
            if(JSON.parse(data.statusCode === 200)){
                const obj = Object.assign(tokendata, JSON.parse(data.text));
                // console.log(obj);
                return cb(null, obj);
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
    
function saveData(newdata, cb){
    
    // console.log(arg2);
    // console.log(JSON.parse(data.text).name, 'in save data')
    // let userdata = JSON.parse(newdata.text);
    // console.log(newdata,"in savedata");
    onboardingDao.addRecord(newdata.name,newdata.email,newdata.avatar_url)
        .then(data =>{
            if(data === 'OK')
                return cb(null, newdata);
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
    loginWithGoogle,
    loginWithGithub,
    getAllUsers,
    getTeam,
    getTeamMembers,
    // getGoogleToken
}