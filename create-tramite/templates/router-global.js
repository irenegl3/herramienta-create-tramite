//let express = require('express');
//let router = express.Router();
//const enums = require('../enums');
// let permisoController = require('../controllers/permiso_controller');
// const routerGestionTitulos = require('./gestion-titulos/routerAlumno');
// const routerGestionCertificados = require('./gestion-certificados/routerAlumno');
// const routerEvaluacionCurricular = require('./evaluacion-curricular/routerAlumno');
// const peticionTituloController = require('../controllers/gestion-titulos/peticion_controller');

const router = require("../../gestion-tramites/back/routes/gestion-titulos/routerAlumno");

//hacer que enums sea simplemente asi:
var tramites = [
    ["gestion-titulos", "Petición de título de grado/máster"],
    ["gestion-certificados", "Petición de certificados académicos"],
    ["evaluacion-curricular", "Solicitud de evaluación curricular"]
];


//TODO quitar updateDatabase cuando ya se haya actualizado la base de datos
/*router.get(`/`, peticionTituloController.updateDatabase,
    function (req, res, next) {
        req.session.tramite = null;
        res.render("pagina-principal", {
            barraInicioText: "LISTA DE TRÁMITES DISPONIBLES ONLINE",
            tramites: enums.tramites
        })
    });
*/
console.log(tramites[0][1])
//var router;
router.use('/:tramite',function (req, res, next) {
    req.session.tramite = req.params.tramite;
    //router = require('./'+tramite+'/routerAlumno');
    next();
}, router);
/*
router.use(`/${enums.tramites.gestionTitulos[0]}`, function (req, res, next) {
    req.session.tramite = enums.tramites.gestionTitulos[0];
    next();
}, routerGestionTitulos);


router.use(`/${enums.tramites.gestionCertificados[0]}`, function(req,res,next){
    req.session.tramite = enums.tramites.gestionCertificados[0];
    next();
}, routerGestionCertificados);


router.use(`/${enums.tramites.evaluacionCurricular[0]}`, function(req,res,next){
    req.session.tramite = enums.tramites.evaluacionCurricular[0];
    next();
}, routerEvaluacionCurricular);
*/



//module.exports = router;




//const routerGestionTitulos = require('./gestion-titulos/routerAlumno');
//const routerGestionCertificados = require('./gestion-certificados/routerAlumno');
const routerEvaluacionCurricular = require('./evaluacion-curricular/routerAlumno');

const peticionTituloController = require('../controllers/gestion-titulos/peticion_controller');

var routersTramites ={};
for(var i=0;i<enums.tramites.length;i++){
    const requires = require('./'+enums.tramites[i][0]+'/routerAlumno');
    routersTramites[enums.tramites[i][0]]=requires;
}

var tramite;
var mwFunction =function(){};
var f = function (req, res, next) {
    console.log('entra f');
    req.session.tramite = req.params.tramite;
    tramite =  req.params.tramite;
    mwFunction = routersTramites[tramite];
    next();
}

router.use('/:tramite',f,mwFunction);
