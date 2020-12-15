var express = require('express');
var router = express.Router();
const empresa = require('../models/empresa');
const usuario = require('../models/usuario');

//Crear una empresa
router.post('/', function(req, res) {
    empresa.exists(
        { $or: [ {titulo:req.body.titulo}, {identificador:req.body.identificador} ] },
        function (err, doc) {
        if (err) { 
            console.log(err);
            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
            res.end();
        } else {
            if (doc) {
                res.send({codigo: 0, mensaje: 'No es posible guardar los datos, el título o el identificador ya están en uso.'});
                res.end();
            } else {
                let e = new empresa(
                    {
                        titulo: req.body.titulo,
                        imagen: req.body.imagen,
                        identificador: req.body.identificador,
                        descripcion: req.body.descripcion,
                        palabrasClaves: req.body.palabrasClave,
                        favicon: req.body.favicon,
                        estado: true,
                        usuario: req.session.idUsuario,
                        bloques: []
                    }
                );
                e.save().then(result=>{
                    usuario.updateOne(
                        { _id: req.session.idUsuario },
                        { "$push": { empresas: result._id }
                        },
                        function(e, r) {
                            if (e) {
                                console.log(e);
                            } else {
                                console.log(r);
                                res.send({codigo: 1, mensaje: '¡Nueva empresa agregada!', respuesta: result});
                                res.end();
                            }
                        }
                    );
                }).catch(error=>{
                    res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
                    res.end();
                });
            }
        } 
    });
});

//Obtener una empresa
router.get('/:id', function(req,res) {
    empresa.find({_id:req.params.id}).then(result=>{
        if (result.length == 0) {
            res.send({codigo: 0, mensaje: 'La empresa solicitada no existe.'});
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

//Obtener todas las empresas
router.get('/',function(req,res) {
    empresa.find().then(result=>{
        res.send({codigo: 1, respuesta: result});
        res.end();
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Obtener lista de empresas habilitadas
router.get('/companies-list',function(req,res) {
    empresa.find({estado: true}).then(result=>{
        res.send({codigo: 1, respuesta: result});
        res.end();
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Actualizar un plan
// router.put('/:id',function(req, res) {
//     plan.find({nombre:req.body.txtNombre}).select('_id').then(doc=>{
//         // Buscar plan con mismo nombre pero no el mismo que se va actualizar
//         if ((doc.length != 0) && (doc[0]._id != req.params.id)) {
//             res.send({codigo:0, mensaje: 'Ya existe un plan con ese nombre, elija uno nuevo.', respuesta: doc});
//             res.end();
//         } else {
//             plan.updateOne(
//                 {_id:req.params.id},
//                 {
//                     nombre: req.body.txtNombre,
//                     precio: req.body.txtPrecio,
//                     empresas: req.body.txtEmpresas,
//                     categorias: req.body.txtCategorias,
//                     productos: req.body.txtProductos,
//                     archivos: req.body.txtArchivos
//                 },
//                 function (error, result) { 
//                 if (error) {
//                     res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.', respuesta: error});
//                     res.end();
//                 } 
//                 else {
//                     res.send({codigo: 1, mensaje: '¡Plan actualizado con éxito!', respuesta: result});
//                     res.end();
//                 } 
//             });
//         }
//     }).catch(err=>{
//         res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: err});
//         res.end();
//     });
// });

//Eliminar un plan
// router.delete('/:id', function(req,res) {
    // TODO: Buscar si el plan esta en uso por algun usuario
    // plan.deleteOne(
    //     {
    //         _id: req.params.id
    //     },
    //     function (error, result) { 
    //         if (error){
    //             res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
    //             res.end();
    //         } else{
    //             res.send({codigo: 1, mensaje: '¡Plan eliminado con éxito!', respuesta: result});
    //             res.end();
    //         }
    //     });
// });

module.exports = router;