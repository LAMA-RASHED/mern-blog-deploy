const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info:{
        title:'Blog platform API'
    }
}

const routes = ['./index.js'];
const outFile= './swagger.json';
swaggerAutogen(outFile, routes, doc)