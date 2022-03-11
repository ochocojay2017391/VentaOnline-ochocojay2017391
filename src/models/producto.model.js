const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductosSchema = Schema({
    nombre: String,
    cantidad: Number,
    vendido: Number,
    precio: Number
});

module.exports = mongoose.model('Productos', ProductosSchema)