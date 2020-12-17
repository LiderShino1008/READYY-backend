var mongoose = require('mongoose');

var archivo = new mongoose.Schema({    
    nombre: String,
    ruta: mongoose.SchemaTypes.Mixed,
    tipo: String,
    usuario: { type: mongoose.ObjectId, ref: "usuarios", require: true }
});

module.exports = mongoose.model('archivos', archivo);