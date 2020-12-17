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
    res.send({codigo: 1, mensaje: 'La sesión ha sido cerrada.', respuesta: req.session});
    res.end();
});

// Obtener credenciales de sesion
router.post('/sessionParameters',function(req,res) {
    // Hay variables de sesion en el servidor...
    if (req.session.idUsuario != null || req.session.idUsuario != undefined) {
        // Son iguales a las que el cliente tiene guardadas
        if (req.session.idUsuario == req.body.idUsuario) {
            res.send({codigo: 1, respuesta: {id: req.session.idUsuario, tipoUsuario: req.session.tipoUsuario}});
            res.end();
        // Son diferentes a las que tiene el cliente
        } else {
            req.session.destroy();
            res.send({codigo: 2, respuesta: null});
            res.end();
        }
    // No existen variables de sesion en el servidor...
    } else {
        // El cliente tiene variables guardadas -> crear en servidor
        if (req.body.idUsuario != null || req.body.idUsuario != undefined){
            req.session.idUsuario = req.body.idUsuario;
            req.session.tipoUsuario = req.body.tipoUsuario;
            res.send({codigo: 3, respuesta: {id: req.session.idUsuario, tipoUsuario: req.session.tipoUsuario}});
            res.end();
        // El cliente no tiene ninguna variable de sesion guardada
        } else {
            res.send({codigo: 0, respuesta: null});
            res.end();
        }
    }
});

module.exports = router;