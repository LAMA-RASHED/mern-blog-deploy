const morgan = require('morgan');
const fs = require('fs');

const date = new Date().toISOString().split('T')[0]

module.exports = morgan('combined', {
    stream: fs.createWriteStream(`./logs/${date}.log`, {flags:'a+'}),
})
