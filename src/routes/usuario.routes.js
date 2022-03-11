const express = require('express');
const usuariosController = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autentificacion');
const api= express.Router();


api.post('/registrar', usuariosController.Registrar);
api.post('/login', usuariosController.Login);
api.put('/editarUsuario/:idUsuario',md_autenticacion.Auth, usuariosController.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.Auth, usuariosController.EliminarUsuario);
api.put('/carritoAfactura', md_autenticacion.Auth, usuariosController.carritoAfactura);



module.exports = api;