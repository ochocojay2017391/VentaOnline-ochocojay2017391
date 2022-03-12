const Usuarios = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const md_autenticacion = require('../middlewares/autentificacion');

const Producto = require('../models/producto.model');



//Registrar Usuario por defecto 
function UsuarioInicial(){
    var usuariosModels = new Usuarios();

        usuariosModels.nombre = 'ErickBran';
        usuariosModels.usuario = 'admin';
        usuariosModels.rol = 'ADMIN';

        Usuarios.find((err, usuarioEncontrado)=> {
            if(usuarioEncontrado.length == 0){

                bcrypt.hash('123456', null, null, (err, paswordEncriptada)=>{
                    usuariosModels.password = paswordEncriptada;
                });
                usuariosModels.save()
            }
        })
}
function Registrar(req, res) {
    var parametros = req.body;
    var usuariosModels = new Usuarios();

    if(parametros.nombre,parametros.usuario, parametros.password){
        usuariosModels.nombre = parametros.nombre;
        usuariosModels.usuario = parametros.usuario;
        usuariosModels.rol = 'CLIENTE';

        Usuarios.find({usuario: parametros.usuario}, (err, usuarioEncontrado)=> {
            if(usuarioEncontrado.length == 0){

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada)=>{
                    usuariosModels.password = passwordEncriptada;
                });
                usuariosModels.save((err, usuarioGuardado)=>{
                    if(err) return res.status(500).send({mensaje:"Error en la peticion"});
                    if(!usuarioGuardado) return res.status(400).send({mensaje:"Error al agregar el usuario"});
                    return res.status(200).send({usuario: usuarioGuardado});
                })
            } else {
                return res.status(500).send({mensaje: 'Este usuario ya se encuentra utilizado'})
            }
        })
    }
}



function Login(req, res){
    var parametros = req.body;

    Usuarios.findOne({usuario: parametros.usuario}, (err, usuarioEncontrado) =>{
        if(err) return res.status(500).send({mensaje:"Error en la peticion"});
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword)=>{
                if(verificacionPassword){
                    if(parametros.obtenerToken === 'true'){
                        return res.status(200).send({token: jwt.crearToken(usuarioEncontrado)})
                    }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuario: usuarioEncontrado})
                    }
                }else{
                    return res.status(500).send({mensaje: 'la pasword no coincide'})
                }
            })

        }else{
            return res.status(500).send({mensaje:"Error, el correo no se encuentra registrado"})
        }
    })
}



function EditarUsuario(req,res){
    var idUser = req.params.idUsuario;
    var parametros = req.body;
   
     if( idUser !== req.user.idUsuario, req.user.rol !== "ADMIN" ) return res.status(500).send({mensaje: 'no puede editar otros usuarios'});
     Usuarios.findByIdAndUpdate(req.user.sub, parametros,{new:true}, (err, usuarioActualizado) =>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!usuarioActualizado) return res.status(404).send({mensaje: 'Error al Editar el Usuario'})
        return res.status(200).send({usuario: usuarioActualizado});
        
        })
    
} 




function EliminarUsuario(req,res){
    var idUser = req.params.idUsuario;
    if(idUser !== req.user.sub, req.user.rol !== "ADMIN") return res.status(500).send({mensaje: 'no puede eliminar otros usuarios'});
    Usuarios.findByIdAndDelete(idUser, (err, userEliminado) =>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!userEliminado) return res.status(404).send({mensaje: 'Error al Eliminar el Usuario'})
        return res.status(200).send({usuario: userEliminado});
    }) 
}

function agregarProductoCarrito(req, res) {
    const usuarioLogeado = req.user.sub;
    const parametros = req.body;

    Producto.findOne({ nombre: parametros.nombreProducto }, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
        if(!productoEncontrado) return res.status(404).send({ mensaje: 'Error al obtener el Producto'});

        Usuarios.findByIdAndUpdate(usuarioLogeado, { $push: { carrito: { nombreProducto: parametros.nombreProducto,
            cantidadComprada: parametros.cantidad, precioUnitario: productoEncontrado.precio } } }, { new: true}, 
            (err, usuarioActualizado)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion de Usuario"});
                if(!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al agregar el producto al carrito'});

                let totalCarritoLocal = 0;

                for(let i = 0; i < usuarioActualizado.carrito.length; i++){
                    // totalCarritoLocal = totalCarritoLocal + usuarioActualizado.carrito[i].precioUnitario;
                    totalCarritoLocal += usuarioActualizado.carrito[i].precioUnitario;
                }

                Usuarios.findByIdAndUpdate(usuarioLogeado, { totalCarrito: totalCarritoLocal }, {new: true},
                    (err, totalActualizado)=> {
                        if(err) return res.status(500).send({ mensaje: "Error en la peticion de Total Carrito"});
                        if(!totalActualizado) return res.status(500).send({ mensaje: 'Error al modificar el total del carrito'});

                        return res.status(200).send({ usuario: totalActualizado })
                    })
            })
    })


    
}


function carritoAfactura(req, res){
    Usuarios.findByIdAndUpdate(req.user.sub, { $set: { carrito: [] }, totalCarrito: 0 }, { new: true }, 
        (err, carritoVacio)=>{
            return res.status(200).send({ usuario: carritoVacio })
        })

}




module.exports = {
    UsuarioInicial,
    Registrar,
    Login,
    EditarUsuario,
    EliminarUsuario,
    carritoAfactura,
    agregarProductoCarrito
}


