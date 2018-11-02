const express = require('express');
//const request = require('superagent');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const onboarding = require('./api/onboarding/index');
const ENV = require('./config/environment');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(ENV.apiEndPoint,onboarding);
//app.use(cookieParser());

console.log(ENV,"lklkljas");
app.listen('4000', (err)=>{
    if(err)
        throw err;
    console.log('Server running on 4000');
});