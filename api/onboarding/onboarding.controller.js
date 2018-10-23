const onboardingDao = require('../../dao/onboarding/onboarding.dao');
const request = require('superagent');
const keys = require('../../config/keys');

const waterfall = require('async/waterfall');
const async = require('async');

// const passportLocal = require('passport-local').LocalStrategy;
const jwt = require('jsonwebtoken');


function getUsers(req, res) {
    let data = {
        userid : req.params.id
    }
    onboardingDao.findRecord(data).then(data => {
        res.status('200').send({
            payload: data
        });
    });
}

function getAllUsersController(req, res) {
    onboardingDao.findAllUsers().then(data =>{
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
    // console.log("inside get google Token")
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
        
        if(data.body.access_token){
            // console.log(data.body.access_token,"access");
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
    // console.log( "inside getGoogleUserData")
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
                let obj = Object.assign(tokendata, JSON.parse(data.text));
                // let jwt_token = jwt.sign({token: JSON.parse(data.text)}, 'ankit');
                // console.log(jwt_token);
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
            console.log(err);
        })
    // }
}

function saveGoogleData(data, cb){
    // console.log(arg2);
    // console.log(JSON.parse(data.text).name, 'in save data')
    // let userdata = JSON.parse(data.text);
    //console.log(userdata);
    let obj = {
        name: data.name,
        email: data.email,
        picture: data.picture
    }
    let jwt_token = jwt.sign({token: obj}, 'ankit');
    let responseObj = {
        jwtToken : jwt_token,
        userData : obj
    }
    onboardingDao.addRecord(data.name,data.email,data.picture,jwt_token)
        .then(newdata =>{
            if(newdata === 'OK')
                return cb(null, responseObj);
            else if(newdata === 'Already'){
                return cb(null, responseObj);
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
    
    if(tokendata.access_token){
        request
        .get(`https://api.github.com/user`)
        .set({
            'Authorization': `token ${tokendata.access_token}`
        })
        .send({
        }).then(data=>{
            if(JSON.parse(data.statusCode === 200)){
                const obj = Object.assign(tokendata, JSON.parse(data.text));
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
    console.log(data.jwtToken);
    res.send(data);
    cb(null);
}

module.exports = {
    loginWithGoogle,
    loginWithGithub,
    getUsers,
    getTeam,
    getTeamMembers,
    getAllUsersController
    // getGoogleToken
}