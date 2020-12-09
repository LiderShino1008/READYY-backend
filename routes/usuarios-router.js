var express = require('express');
var router = express.Router();
const usuario = require('../models/usuario');
const plan = require('../models/plan');

//Crear un usuario
router.post('/', function(req, res) {
    usuario.exists({email:req.body.txtEmail}, function (err, doc) {
        if (err) { 
            console.log(err);
            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
            res.end();
        } else {
            if (doc) {
                res.send({codigo: 0, mensaje: 'El correo electrónico que ingresó está en uso, elija uno nuevo.'});
                res.end();
            } else {
                let u;
                switch (req.body.txtTipoUsuario) {
                    case 'Cliente':
                        u = new usuario({
                            nombre: req.body.txtNombre,
                            apellido: req.body.txtApellido,
                            fechaNacimiento: req.body.txtNacimiento,
                            email: req.body.txtEmail,
                            password: req.body.txtPwd1,
                            tipoUsuario: req.body.txtTipoUsuario,
                            historialCompras: []
                        });
                        u.save().then(result=>{
                            res.send({codigo: 1, mensaje: '¡Usuario agregado con éxito!', respuesta: result});
                            res.end();
                        }).catch(error=>{
                            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
                            res.end();
                        });
                        break;
                    case 'Administrador de negocios':
                        plan.find({_id:req.body.txtPlanServicio}).then(result=>{
                            u = new usuario({
                                nombre: req.body.txtNombre,
                                apellido: req.body.txtApellido,
                                fechaNacimiento: req.body.txtNacimiento,
                                email: req.body.txtEmail,
                                password: req.body.txtPwd1,
                                tipoUsuario: req.body.txtTipoUsuario,
                                planServicio: {
                                    id: result[0]._id,
                                    nombre: result[0].nombre,
                                    empresas: result[0].empresas,
                                    categorias: result[0].categorias,
                                    productos: result[0].productos,
                                    archivos: result[0].archivos
                                },
                                nombreEmpresa: req.body.txtNombreEmpresa,
                                descripcionEmpresa: req.body.txtDescripcionEmpresa,
                                direccionEmpresa: req.body.txtDireccionEmpresa,
                                categorias: [],
                                archivos: [],
                                empresas: []
                            });
                            u.save().then(result=>{
                                res.send({codigo: 1, mensaje: '¡Usuario agregado con éxito!', respuesta: result});
                                res.end();
                            }).catch(error=>{
                                res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
                                res.end();
                            });
                        }).catch(error=>{
                            console.log(error);
                        });
                        break;
                    case 'Administrador de plataforma':            
                        u = new usuario({
                            nombre: req.body.txtNombre,
                            apellido: req.body.txtApellido,
                            fechaNacimiento: req.body.txtNacimiento,
                            email: req.body.txtEmail,
                            password: req.body.txtPwd1,
                            tipoUsuario: req.body.txtTipoUsuario
                        });
                        u.save().then(result=>{
                            res.send({codigo: 1, mensaje: '¡Usuario agregado con éxito!', respuesta: result});
                            res.end();
                        }).catch(error=>{
                            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
                            res.end();
                        });
                        break;
                }
            }
        } 
    });
});

//Obtener un usuario
router.get('/:id', function(req,res) {
    usuario.find({_id:req.params.id}).then(result=>{
        if (result.length == 0) {
            res.send({codigo: 0, mensaje: 'El usuario solicitado no existe.'});
            res.end();
        } else {
            res.send({codigo: 1, respuesta: result[0]});
            res.end();
        }
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Obtener todos los usuarios
router.get('/',function(req,res) {
    usuario.find().then(result=>{
        res.send({codigo: 1, respuesta: result});
        res.end();
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Actualizar un usuario
router.put('/:id',function(req, res) {
    let updateQuery;
    switch (req.body.txtTipoUsuario) {
        case 'Administrador de negocios':
            updateQuery = {
                nombre: req.body.txtNombre,
                apellido: req.body.txtApellido,
                fechaNacimiento: req.body.txtNacimiento,
                planServicio: req.body.txtPlanServicio,
                nombreEmpresa: req.body.txtNombreEmpresa,
                descripcionEmpresa: req.body.txtDescripcionEmpresa,
                direccionEmpresa: req.body.txtDireccionEmpresa
            };
            break;
    
        default:
            updateQuery = {
                nombre: req.body.txtNombre,
                apellido: req.body.txtApellido,
                fechaNacimiento: req.body.txtNacimiento
            };
            break;
    }
    usuario.updateOne(
        {_id:req.params.id},
        updateQuery,
        function (error, result) { 
        if (error) {
            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.', respuesta: error});
            res.end();
        } 
        else {
            res.send({codigo: 1, mensaje: '¡Información actualizada con éxito!', respuesta: result});
            res.end();
        } 
    });
});

// Actualizar contraseña de un usuario
router.put('/:id/password', function(req, res) {
    usuario.exists({_id: req.params.id, password:req.body.txtPasswordAnterior}, function (err, doc) {
        if (err) { 
            console.log(err);
            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
            res.end();
        } else {
            if (!doc) {
                res.send({codigo: 0, mensaje: 'La contraseña anterior no coincide, intente de nuevo.'});
                res.end();
            } else {
                usuario.updateOne(
                    {_id:req.params.id},
                    {password: req.body.txtPasswordNueva},
                    function (error, result) { 
                    if (error) {
                        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.', respuesta: error});
                        res.end();
                    } 
                    else {
                        res.send({codigo: 1, mensaje: '¡Información actualizada con éxito!', respuesta: result});
                        res.end();
                    } 
                });
            }
        } 
    });
})

//Eliminar un usuario
router.delete('/:id', function(req,res) {
    usuario.deleteOne(
        {
            _id: req.params.id
        },
        function (error, result) { 
            if (error){
                res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
                res.end();
            } else{
                res.send({codigo: 1, mensaje: '¡Usuario eliminado con éxito!', respuesta: result});
                res.end();
            }
        });
});

module.exports = router;