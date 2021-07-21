let express = require('express');
var router = express.Router({mergeParams: true});
let fs = require('fs-extra');
let peticionController = require('./../controllers/peticion_controller'); // apis basicas

var getDescripcion = function (nombreTramite) {
  let rawdata = fs.readFileSync(process.cwd()+'/enums/'+nombreTramite+'/enum.json');
  let configFile = JSON.parse(rawdata);
  let descripcion = configFile.descripcionTramite;
  return descripcion;
}

router.get('/', function (req, res) {
  let tramite = req.session.tramite;
  let descripcionTramite = getDescripcion(tramite);
  res.locals.barraInicioText = descripcionTramite;
  res.render('index');
});

router.get('/api/getPeticiones', peticionController.getPeticionByUUID)
router.post('/api/updatePeticion', peticionController.configureMultiPartFormData, peticionController.updatePeticionById)
router.post('/api/createPeticion', peticionController.configureMultiPartFormData, peticionController.createPeticionAlumno)

module.exports = router;