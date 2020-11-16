var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('<html><body><h1>Hola mundo</h1></body></html>');
});

app.listen(8888, function () {
    console.log('READYY-backend');
});