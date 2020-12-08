var mongoose = require('mongoose');

class Database{
    constructor(){
        this.conectar();
    }

    conectar(){
        mongoose.connect('mongodb+srv://walter:walter1008@cluster0.nhjk3.mongodb.net/readyy?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(result=>console.log('¡MongoDB Atlas en línea!'))
        .catch(error=>console.log(error));
    }
}

module.exports = new Database();