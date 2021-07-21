let express = require('express');
let router = express.Router();

//requires controllers faltan
const controllers = require('../../controllers'); //o poner directamente las router.get y post, exportadas desde cada controller

let rawdata = fs.readFileSync('config.json');
let configFile = JSON.parse(rawdata);

router.get('/', function (req, res) {
  res.locals.barraInicioText = configFile.descripcionTramite;
  res.render('index');
});

/*
router.get('/api/peticiones', peticionController.getInfoAllAlumno)
router.post('/api/peticionCambioEstado', peticionController.configureMultiPartFormData, peticionController.updateOrCreatePeticion)
router.get('/api/asignaturas/titulacion', queriesController.getDatosFormularioTitulacion)
router.get('/api/asignaturas/curso', queriesController.getDatosFormularioCurso)
router.get('/api/estadoTramite', peticionController.getEstadoTramite)
*/

module.exports = router;