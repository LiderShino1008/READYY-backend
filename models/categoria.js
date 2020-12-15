var mongoose = require('mongoose');

var categoria = new mongoose.Schema({
    nombre: String,
    productos: [
        {
            _id: mongoose.Types.ObjectId,
            nombre: String,
            imagen: mongoose.SchemaTypes.Mixed,
            precio: Number
        }
    ],
    usuario: { type: mongoose.ObjectId, ref: 'usuarios', require: true }
});

module.exports = mongoose.model('categorias', categoria);