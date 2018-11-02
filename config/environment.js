environment = process.env.NODE_ENV
server = {}
if(environment === 'dev'){
    server = {
        host: 'localhost:4000',
        apiEndPoint: '/'
    }
}

if(environment === 'prod'){
    server = {
        host: 'agiler.blr.stackroute.in',
        apiEndPoint: '/auth-service'
    }
}

module.exports = server