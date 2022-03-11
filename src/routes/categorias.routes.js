const express = require('express');
const categoriaControllador = require('../controllers/categorias.controller');

const md_autenticacion = require('../middlewares/autentificacion');
const api = express.Router();
api.post('/agregarCategoria', md_autenticacion.Auth, categoriaControllador.agregarCategoria );
api.get('/obtenerCategoriasCreadas', md_autenticacion.Auth, categoriaControllador.obtenerCategoriasCreadas);
api.put('/editarCategoria/:idUsuario/:idCategoria',md_autenticacion.Auth, categoriaControllador.EditarCategoria);
categoriaControllador.CategoriaInicial();
module.exports = api;