var mongoose = require('mongoose');

var cliente = new mongoose.Schema({
    // General
    nombre: String,
    apellido: String,
    fechaNacimiento: String,
    email: String,
    password: String,
    tipoUsuario: String,
    // Cliente
    historialCompras: mongoose.SchemaTypes.Mixed,
    // Administrador de negocios
    planServicio: /*mongoose.SchemaTypes.Mixed,*/{
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
    categorias: mongoose.SchemaTypes.Mixed,
    archivos: mongoose.SchemaTypes.Mixed,
    empresas: mongoose.SchemaTypes.Mixed
});

module.exports = mongoose.model('usuarios', cliente);