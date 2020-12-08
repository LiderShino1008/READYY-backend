var mongoose = require('mongoose');

var cliente = new mongoose.Schema({
    // General
    nombre: String,
    apellido: String,
    fechaNacimiento: String,
    email: String,
    password: String,
    tipoUsuario: {
        codigo: String,
        descripcion: String
    },
    // Cliente
    historialCompras: { type : Array , "default" : [] },
    // Administrador de negocios
    planServicio: {
        id: String,
        nombre: String,
        empresas: Number,
        archivos: Number,
        categorias: Number,
        productos: Number
    },
    nombreEmpresa: String,
    descripcionEmpresa: String,
    direccionEmpresa: String,
    categorias: { type : Array , "default" : [] },
    archivos: { type : Array , "default" : [] },
    empresas: { type : Array , "default" : [] }
});

module.exports = mongoose.model('usuarios', cliente);