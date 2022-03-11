const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    nombre: String,
    usuario: String,
    password: String,
    rol: String, 
    carrito: [{
        nombreProducto: String,
        cantidadComprada: Number,
        precioUnitario: Number
    }],
    totalCarrito: Number
});

module.exports = mongoose.model('usuarios', UsuariosSchema);