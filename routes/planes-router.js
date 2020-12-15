var express = require('express');
var router = express.Router();
const plan = require('../models/plan');
// const usuario = require('../models/usuario');

//Crear un plan
router.post('/', function(req, res) {
    plan.exists({nombre:req.body.txtNombre}, function (err, doc) {
        if (err) { 
            console.log(err);
            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
            res.end();
        } else {
            if (doc) {
                res.send({codigo: 0, mensaje: 'Ya existe un plan con ese nombre, elija uno nuevo.'});
                res.end();
            } else {
                let p = new plan(
                    {
                        nombre: req.body.txtNombre,
                        precio: req.body.txtPrecio,
                        empresas: req.body.txtEmpresas,
                        categorias: req.body.txtCategorias,
                        productos: req.body.txtProductos,
                        archivos: req.body.txtArchivos
                    }
                );
                p.save().then(result=>{
                    res.send({codigo: 1, mensaje: '¡Nuevo plan agregado!', respuesta: result});
                    res.end();
                }).catch(error=>{
                    res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
                    res.end();
                });
            }
        } 
    });
});

//Obtener un plan
router.get('/:id', function(req,res) {
    plan.find({_id:req.params.id}).then(result=>{
        if (result.length == 0) {
            res.send({codigo: 0, mensaje: 'El plan solicitado no existe.'});
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

//Obtener todos los planes
router.get('/',function(req,res) {
    plan.find().then(result=>{
        res.send({codigo: 1, respuesta: result});
        res.end();
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Actualizar un plan
router.put('/:id',function(req, res) {
    plan.find({nombre:req.body.txtNombre}).select('_id').then(doc=>{
        // Buscar plan con mismo nombre pero no el mismo que se va actualizar
        if ((doc.length != 0) && (doc[0]._id != req.params.id)) {
            res.send({codigo:0, mensaje: 'Ya existe un plan con ese nombre, elija uno nuevo.', respuesta: doc});
            res.end();
        } else {
            plan.updateOne(
                {_id:req.params.id},
                {
                    nombre: req.body.txtNombre,
                    precio: req.body.txtPrecio,
                    empresas: req.body.txtEmpresas,
                    categorias: req.body.txtCategorias,
                    productos: req.body.txtProductos,
                    archivos: req.body.txtArchivos
                },
                function (error, result) { 
                if (error) {
                    res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.', respuesta: error});
                    res.end();
                } 
                else {
                    res.send({codigo: 1, mensaje: '¡Plan actualizado con éxito!', respuesta: result});
                    res.end();
                } 
            });
        }
    }).catch(err=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: err});
        res.end();
    });
});

//Eliminar un plan
router.delete('/:id', function(req,res) {
    // TODO: Verificar si funciona
    // usuario.find({planServicio: { $ne: null }}).then(result=>{
    //     if (result.length==0) {
    //         plan.deleteOne(
    //             { _id: req.params.id },
    //             function (e, r) { 
    //                 if (e){
    //                     res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: e});
    //                     res.end();
    //                 } else{
    //                     res.send({codigo: 1, mensaje: '¡Plan eliminado con éxito!', respuesta: r});
    //                     res.end();
    //                 }
    //             });
    //     } else {
    //         res.send({codigo: 0, mensaje: 'No se puede eliminar. Este plan está en uso.', respuesta: r});
    //         res.end();
    //     }
    // }).catch(error=>{
    //     res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
    //     res.end();
    // });
    plan.deleteOne(
        {
            _id: req.params.id
        },
        function (e, r) { 
            if (e){
                res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: e});
                res.end();
            } else{
                res.send({codigo: 1, mensaje: '¡Plan eliminado con éxito!', respuesta: r});
                res.end();
            }
        });
});

module.exports = router;