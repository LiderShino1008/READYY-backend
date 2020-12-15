var mongoose = require('mongoose');

var empresa = new mongoose.Schema({
    titulo: String,
    imagen: mongoose.SchemaTypes.Mixed,
    identificador: String,
    descripcion: String,
    palabrasClaves: String,
    favicon: mongoose.SchemaTypes.Mixed,
    estado: Boolean,
    usuario: { type: mongoose.ObjectId, ref: "usuarios", require: true },
    bloques: mongoose.SchemaTypes.Mixed
});

module.exports = mongoose.model('empresas', empresa);