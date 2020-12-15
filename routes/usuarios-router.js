var express = require('express');
var router = express.Router();
const usuario = require('../models/usuario');

//Crear un usuario
router.post('/', function(req, res) {
    usuario.exists({email:req.body.ur_txtEmail}, function (err, doc) {
        if (err) { 
            console.log(err);
            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
            res.end();
        } else {
            if (doc) {
                res.send({codigo: 0, mensaje: 'El correo electrónico está en uso, elija uno nuevo.'});
                res.end();
            } else {
                let u;
                switch (req.body.ur_txtTipoUsuario) {
                    case 'Cliente':
                        u = new usuario({
                            nombre: req.body.ur_txtNombre,
                            apellido: req.body.ur_txtApellido,
                            fechaNacimiento: req.body.ur_txtNacimiento,
                            email: req.body.ur_txtEmail,
                            password: req.body.ur_txtPwd1,
                            tipoUsuario: req.body.ur_txtTipoUsuario,
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
                        u = new usuario({
                            nombre: req.body.ur_txtNombre,
                            apellido: req.body.ur_txtApellido,
                            fechaNacimiento: req.body.ur_txtNacimiento,
                            email: req.body.ur_txtEmail,
                            password: req.body.ur_txtPwd1,
                            tipoUsuario: req.body.ur_txtTipoUsuario,
                            planServicio: req.body.ur_txtPlan,
                            nombreEmpresa: req.body.ur_txtNombreEmpresa,
                            descripcionEmpresa: req.body.ur_txtDescripcionEmpresa,
                            direccionEmpresa: req.body.ur_txtDireccionEmpresa,
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
                        break;
                    case 'Administrador de plataforma':            
                        u = new usuario({
                            nombre: req.body.ur_txtNombre,
                            apellido: req.body.ur_txtApellido,
                            fechaNacimiento: req.body.ur_txtNacimiento,
                            email: req.body.ur_txtEmail,
                            password: req.body.ur_txtPwd1,
                            tipoUsuario: req.body.ur_txtTipoUsuario
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
    usuario.find({_id:req.params.id})
    .select('-password')
    .then(result=>{
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

//Obtener usuario administrador de negocios
router.get('/admin-business/:id', function(req,res) {
    usuario.find({_id:req.params.id})
    .populate('planServicio')
    .populate('categorias')
    .populate('archivos')
    .populate('empresas', { usuario: 0, bloques: 0} )
    .select('-password')
    .then(result=>{
        if (result.length == 0) {
            res.send({codigo: 0, mensaje: 'El usuario solicitado no existe.'});
            res.end();
        } else {
            res.send({codigo: 1, respuesta: result[0]});
            res.end();
        }
    }).catch(error=>{
        console.log(error);
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Obtener todos los usuarios
router.get('/',function(req,res) {
    usuario.find()
    .select('-password')
    .then(result=>{
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
    switch (req.session.tipoUsuario) {
        case 'Administrador de negocios':
            updateQuery = {
                nombre: req.body.ur_newNombre,
                apellido: req.body.ur_newApellido,
                fechaNacimiento: req.body.ur_newNacimiento,
                planServicio: req.body.ur_newPlan,
                nombreEmpresa: req.body.ur_newNombreEmpresa,
                descripcionEmpresa: req.body.ur_newDescripcionEmpresa,
                direccionEmpresa: req.body.ur_newDireccionEmpresa
            };
            break;
    
        default:
            updateQuery = {
                nombre: req.body.ur_newNombre,
                apellido: req.body.ur_newApellido,
                fechaNacimiento: req.body.ur_newNacimiento
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
    usuario.exists({_id: req.params.id, password:req.body.ur_txtPasswordAnterior}, function (err, doc) {
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
                    {password: req.body.ur_txtPasswordNueva},
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