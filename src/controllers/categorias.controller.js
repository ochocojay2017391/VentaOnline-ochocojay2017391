const Categoria = require("../models/categorias.model");

function CategoriaInicial(){
  var categoriaModel = new Categoria();

      categoriaModel.CategoriaProducto = 'PorDefecto';

      
      Categoria.find((err, categoriaEncontrada)=> {
          if(categoriaEncontrada.length == 0){
            categoriaModel.save();
          }
      })
}

function agregarCategoria(req, res) {
    var parametros = req.body;
    var categoriaModel = new Categoria();
  
    if (req.user.rol == "ADMIN") {
      if (parametros.CategoriaProducto) {
        
        categoriaModel.CategoriaProducto = parametros.CategoriaProducto;
        categoriaModel.idAdmin = req.user.sub;
  
        Categoria.find({ CategoriaProducto: categoriaModel.CategoriaProducto }, (err, categoriaEncontrado) => {
          if (categoriaEncontrado.length == 0) {
            categoriaModel.save((err, categoriaGuardada) => {
              if (err)
                return res.status(500).send({ mensaje: "Error en la peticion" });
              if (!categoriaGuardada)
                return res.status(500).send({ mensaje: "Error al guardar el categoria" });
  
              return res.status(200).send({ Categoria: categoriaGuardada });
            });
          } else {
            return res.status(500).send({ mensaje: "la categoria ya esta creada" });
          }
        });
      } else {
        return res.status(500).send({ mensaje: "Debe rellenar todos los campos" });
      }
    } else {
      return res.status(500).send({ mensaje: "No esta Autorizado" });
    }
  }

  function obtenerCategoriasCreadas(req, res) {
    Categoria.find({ idAdmin: req.user.sub }, (err, categoriasCreadas) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!categoriasCreadas)
        return res.status(500).send({ mensaje: "Error al obtener los Cursos" });
  
      return res.status(200).send({ Categoria: categoriasCreadas });
    }).populate("idAdmin", "nombre categoria");
  }

  function EditarCategoria(req,res){
    var idUser = req.params.idUsuario;
    var idCategoria = req.params.idCategoria;
    var parametros = req.body;
    if(req.user.rol == 'ADMIN'){
        if(idUser !== req.user.sub) return res.status(500).send({mensaje: 'no puede editar otros usuarios'});
        Categoria.findByIdAndUpdate(idCategoria, parametros,{new:true}, (err, usuarioActualizado) =>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!usuarioActualizado) return res.status(404).send({mensaje: 'Error al Editar el Usuario'})
        return res.status(200).send({Categoria: usuarioActualizado});
    })

    }else{
        return res.status(500).send({mensaje:"Usted no esta autorizado"});
    }
}


  module.exports = {
    CategoriaInicial,
    agregarCategoria,
    obtenerCategoriasCreadas,
    EditarCategoria
  };