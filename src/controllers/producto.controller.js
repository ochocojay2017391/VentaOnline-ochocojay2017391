const Productos = require("../models/producto.model");


function AgregarProducto (req, res){
    var parametros = req.body;
    var productoModelo = new Productos();

    if( parametros.nombre && parametros.cantidad && parametros.precio ) {
        productoModelo.nombre = parametros.nombre;
        productoModelo.cantidad = parametros.cantidad;
        productoModelo.precio = parametros.precio;

        productoModelo.save((err, productoGuardado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ningun producto"});

            return res.status(200).send({ producto: productoGuardado });
        })
    }
}

function ObtenerProductos (req, res) {
    Productos.find((err, productosObtenidos) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < productosObtenidos.length; i++) {
            console.log(productosObtenidos[i].nombre)
        }

        return res.send({ productos: productosObtenidos })
            
    })
}



function ObtenerProductoId(req, res) {
    var idProd = req.params.idProductos;

    Productos.findById(idProd, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

function ObtenerProductoNombre(req, res) {
    var nomProd = req.params.nombreProducto;

    Productos.find( { nombre : { $regex: nomProd, $options: 'i' } }, (err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error, no se encontraron productos" });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

function EditarProducto (req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    Productos.findByIdAndUpdate(idProd, parametros, { new: true } ,(err, productoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!productoActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Producto'});

        return res.status(200).send({ producto: productoActualizado});
    });
}

function EliminarProducto(req, res) {
    var idProd = req.params.idProducto;

    Productos.findByIdAndDelete(idProd, (err, productoEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!productoEliminado) return res.status(404).send( { mensaje: 'Error al eliminar el Producto'});

        return res.status(200).send({ producto: productoEliminado});
    })
}

function stockProducto(req, res) {
    const productoId = req.params.idProducto;
    const parametros = req.body;

    Productos.findByIdAndUpdate(productoId, { $inc : { cantidad: parametros.cantidad } }, { new: true },
        (err, productoModificado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoModificado) return res.status(500).send({ mensaje: 'Error al editar la cantidad del Producto'});

            return res.status(200).send({ producto: productoModificado});
        })

    
}

module.exports = {
    AgregarProducto,
    ObtenerProductos,
    ObtenerProductoNombre,
    ObtenerProductoId,
    EditarProducto,
    EliminarProducto,
    stockProducto
};
