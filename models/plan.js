var mongoose = require('mongoose');

var plan = new mongoose.Schema({    
    nombre: String,
    precio: Number,
    empresas: Number,
    categorias: Number,
    productos: Number,
    archivos: Number
});

module.exports = mongoose.model('planes', plan);