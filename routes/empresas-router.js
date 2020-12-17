var express = require('express');
var router = express.Router();
const empresa = require('../models/empresa');
const usuario = require('../models/usuario');

//Crear una empresa
router.post('/', function(req, res) {
    empresa.exists(
        { $or: [ {titulo:req.body.er_txtTitulo}, {identificador:req.body.er_txtIdentificador} ] },
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
                        titulo: req.body.er_txtTitulo,
                        imagen: req.body.er_txtImagen,
                        identificador: req.body.er_txtIdentificador,
                        descripcion: req.body.er_txtDescripcion,
                        palabrasClaves: req.body.er_txtPalabrasClave,
                        favicon: req.body.er_txtFavicon,
                        estado: true,
                        usuario: req.body.idUsuario,
                        bloques: []
                    }
                );
                e.save().then(result=>{
                    usuario.updateOne(
                        { _id: req.body.idUsuario },
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
router.get('/empresa/:id', function(req,res) {
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
    empresa.find()
    .populate('usuario', {nombreEmpresa: 1})
    .select('-bloques -favicon')
    .then(result=>{
        res.send({codigo: 1, respuesta: result});
        res.end();
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Obtener lista de empresas habilitadas
router.get('/companies-list',function(req,res) {
    empresa.find({estado: "true"})
    // .select('-bloques -favicon -estado')
    .populate('usuario', {nombreEmpresa: 1})
    .select('-bloques -favicon -estado')
    .then(result=>{
        res.send({codigo: 1, respuesta: result});
        res.end();
    }).catch(error=>{
        res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.',respuesta: error});
        res.end();
    });
});

//Bloquear o desbloquear empresa
router.put('/:id/estado',function(req, res) {
    empresa.updateOne(
        {_id:req.params.id},
        { estado: req.body.er_newEstado },
        function (error, result) { 
        if (error) {
            res.send({codigo: 99, mensaje: 'Lo sentimos, ha ocurrido un error.', respuesta: error});
            res.end();
        } 
        else {
            ifelse
            res.send({codigo: 1, mensaje: 'El estado de la empresa fue actualizado.', respuesta: result});
            res.end();
        } 
    });
});

//Actualizar un plan
// router.put('/:id',function(req, res) {
//     plan.find({nombre:req.body.er_newNombre}).select('_id').then(doc=>{
//         // Buscar plan con mismo nombre pero no el mismo que se va actualizar
//         if ((doc.length != 0) && (doc[0]._id != req.params.id)) {
//             res.send({codigo:0, mensaje: 'Ya existe un plan con ese nombre, elija uno nuevo.', respuesta: doc});
//             res.end();
//         } else {
//             plan.updateOne(
//                 {_id:req.params.id},
//                 {
//                     nombre: req.body.er_newNombre,
//                     precio: req.body.er_newPrecio,
//                     empresas: req.body.er_newEmpresas,
//                     categorias: req.body.er_newCategorias,
//                     productos: req.body.er_newProductos,
//                     archivos: req.body.er_newArchivos
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