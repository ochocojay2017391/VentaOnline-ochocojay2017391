const jwt_simple = require('jwt-simple');
const moment = require('moment');
const secret = 'claveVentaOnline';

exports.crearToken = function(usuarios){
    let payload = {
        sub: usuarios._id,
        nombre: usuarios.nombre,
        usuario: usuarios.usuario,
        rol: usuarios.rol,
        iat: moment().unix(),
        exp: moment().day(7, 'days').unix(),
        }

        return jwt_simple.encode(payload, secret);
}