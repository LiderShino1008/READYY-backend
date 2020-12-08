// Required node modules
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// Database connection
var database = require('./modules/database');

// Routes
var usuariosRouter = require('./routes/usuarios-router');
var planesRouter = require('./routes/planes-router');
// var empresasRouter = require('./routes/empresas-router');
// var categoriasRouter = require('./routes/categorias-router');
// var productosRouter = require('./routes/productos-router');
// var archivosRouter = require('./routes/archivos-router');

// Express
var app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/usuarios', usuariosRouter);
app.use('/planes', planesRouter);
//app.use('/empresas', empresasRouter);
// app.use('/categorias', categoriasRouter);
// app.use('/productos', productosRouter);
// app.use('/archivos', archivosRouter);

// Backend
app.get('/', function (req, res) {
    res.send('¡Hola Mundo! Esta es la ruta raíz de READYY-backend');
});

app.listen(8888, function () {
    console.log('READYY-backend está levantado en el puerto 8888.');
});