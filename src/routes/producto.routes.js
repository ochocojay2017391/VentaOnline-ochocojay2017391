
const express = require('express');
const productoController = require('../controllers/producto.controller');
//const md_autenticacion =  require('../middlewares/autenticacion');


var api = express.Router();

api.get('/productos', productoController.ObtenerProductos);
api.get('/productos/:idProductos', productoController.ObtenerProductoId);
api.get('/buscarNombreProd/:nombreProducto', productoController.ObtenerProductoNombre);
api.post('/agregarProductos', productoController.AgregarProducto);
api.put('/editarProductos/:idProducto', productoController.EditarProducto);
api.delete('/eliminarProducto/:idProducto', productoController.EliminarProducto);
api.put('/stockProducto/:idProducto', productoController.stockProducto);

module.exports = api;