const onboardingDao = require('../../dao/onboarding/onboarding.dao');
const request = require('superagent');
const keys = require('../../config/keys');

function getGoogleToken(req, res){
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
            request
                .post('https://www.googleapis.com/oauth2/v2/userinfo')
                .set({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization': `Bearer ${data.access_token}`
                })
        }
        else{

        } 
       
     }).then(data =>{
        res.send(JSON.parse(data.text))
     })
}

function getGithubToken(req, res){
    request
     .post()
     .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'  
     })
     .send({
        'code': req.body.code,
        'redirect_uri': 'http://localhost:4200/torii/redirect.html',
        'client_id': keys.github.clientID,
        'client_secret': keys.github.clientSecret,
        'grant_type': 'authorization_code',
        'scope': '',
     }).then(data => {
         if(data.access_token){
            request
            .post('https://api.github.com/user')
            .set()
         }
         
     }).then(data => {
        res.send(JSON.parse(data.text));
     })
}