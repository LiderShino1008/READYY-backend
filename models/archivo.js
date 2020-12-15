var mongoose = require('mongoose');

var archivo = new mongoose.Schema({    
    nombre: String,
    ruta: mongoose.SchemaTypes.Mixed,
    tipo: String,
    extension: String
});

module.exports = mongoose.model('archivos', archivo);