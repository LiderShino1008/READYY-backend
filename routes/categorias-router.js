var express = require('express');
var router = express.Router();
const categoria = require('../models/categoria');
const usuario = require('../models/usuario');

//Crear una categoria
router.post('/', function(req, res) {
    categoria.exists(
        { nombre: req.body.cr_txtNombre },
        function (err, doc) {
        if (err) { 
            console.log(err);
            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
            res.end();
        } else {
            if (doc) {
                res.send({codigo: 0, mensaje: 'No es posible guardar los datos, el nombre ya está en uso.'});
                res.end();
            } else {
                let c = new categoria(
                    {
                        nombre: req.body.cr_txtNombre,
                        productos: [],
                        usuario: req.session.idUsuario
                    }
                );
                c.save().then(result=>{
                    usuario.updateOne(
                        { _id: req.session.idUsuario },
                        { "$push": { categorias: result._id }
                        },
                        function(e, r) {
                            if (e) {
                                console.log(e);
                            } else {
                                console.log(r);
                                res.send({codigo: 1, mensaje: '¡Nueva categoria agregada!', respuesta: result});
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

//Obtener una categoria
router.get('/:id', function(req,res) {
    categoria.find({_id:req.params.id}).then(result=>{
        if (result.length == 0) {
            res.send({codigo: 0, mensaje: 'La categoria solicitada no existe.'});
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

//Obtener todas las categorias
router.get('/',function(req,res) {
    categoria.find().then(result=>{
        res.send({codigo: 1, respuesta: result});
        res.end();
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Agregar producto a una categoria
router.put('/categoria/:id/producto',function(req, res) {
    var myId = mongoose.Types.ObjectId();
    var data = {
        _id: myId,
        nombre: req.body.cr_p_txtNombre,
        imagen: req.body.cr_p_txtImagen,
        precio: req.body.cr_p_txtPrecio
    };
    categoria.updateOne(
        { _id: req.params.id },
        { "$push": { productos: data }
        },
        function(err, result) {
            if (err) {
                res.send(err);
                res.end();
            } else {
                res.send(data);
                res.end();
            }
        }
    );
});

//Actualizar un plan
// router.put('/:id',function(req, res) {
//     plan.find({nombre:req.body.cr_newNombre}).select('_id').then(doc=>{
//         // Buscar plan con mismo nombre pero no el mismo que se va actualizar
//         if ((doc.length != 0) && (doc[0]._id != req.params.id)) {
//             res.send({codigo:0, mensaje: 'Ya existe un plan con ese nombre, elija uno nuevo.', respuesta: doc});
//             res.end();
//         } else {
//             plan.updateOne(
//                 {_id:req.params.id},
//                 {
//                     nombre: req.body.cr_newNombre,
//                     precio: req.body.cr_newPrecio,
//                     empresas: req.body.cr_newEmpresas,
//                     categorias: req.body.cr_newCategorias,
//                     productos: req.body.cr_newProductos,
//                     archivos: req.body.cr_newArchivos
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