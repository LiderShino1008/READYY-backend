var mongoose = require('mongoose');

var usuario = new mongoose.Schema({
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
    planServicio: { type: mongoose.ObjectId, ref: 'planes', require: true },
    nombreEmpresa: String,
    descripcionEmpresa: String,
    direccionEmpresa: String,
    categorias: [ { type: mongoose.ObjectId, ref: 'categorias', require: true } ],
    archivos: [ { type: mongoose.ObjectId, ref: 'archivos', require: true } ],
    empresas: [ { type: mongoose.ObjectId, ref: 'empresas', require: true } ]
});

module.exports = mongoose.model('usuarios', usuario);