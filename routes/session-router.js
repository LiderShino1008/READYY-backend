var express = require('express');
var router = express.Router();
const usuario = require('../models/usuario');

// Iniciar sesion
router.post('/login', function(req, res) {
    usuario.find({ email:req.body.sr_email, password:req.body.sr_password }).select('_id tipoUsuario').then(result=>{
        if (result.length == 0) {
            res.send({codigo: 0, mensaje: 'Credenciales incorrectas.'});
            res.end();
        } else {
            req.session.idUsuario = result[0]._id;
            req.session.tipoUsuario = result[0].tipoUsuario;
            console.log(req.session);
            res.send({codigo: 1, idUsuario: req.session.idUsuario, tipoUsuario: req.session.tipoUsuario});
            res.end();
        }
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

// Cerrar sesion
router.post('/logout', function(req, res) {
    req.session.destroy();
    console.log(req.session);
    res.send({codigo: 1, respuesta: req.session.idUsuario});
    res.end();
});

// Obtener credenciales de sesion
router.post('/sessionParameters',function(req,res) {
    if (req.session.idUsuario != null) {
        res.send({codigo: 1, respuesta: {id: req.session.idUsuario, tipoUsuario: req.session.tipoUsuario}});
        res.end();
    } else {
        res.send({codigo: 0, respuesta: null});
        res.end();
    }
});

module.exports = router;