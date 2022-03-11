const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriasSchema = Schema({
    CategoriaProducto: String,
    idAdmin: {type: Schema.Types.ObjectId, ref:'usuarios'}, 
    
})

module.exports = mongoose.model('categorias', CategoriasSchema);