// Crea la aplicacion
var estructuraApp = require('./creators/estructuraAppCreator');
var baseDeDatos = require('./creators/baseDatosCreator');


module.exports = {
    crearEstructuraApp : estructuraApp.crearEstructuraApp,
    crearBaseDeDatos : baseDeDatos.crearBaseDeDatos
}