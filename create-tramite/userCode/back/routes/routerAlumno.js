let express = require('express');
let router = express.Router();
const enums = require('../enums');
const routerAlumnoPeticion = require('./routerAlumnoPeticion');

router.get(`/`,
    function (req, res, next) {
        req.session.tramite = null;
        res.render("pagina-principal", {
            barraInicioText: "LISTA DE TRÁMITES DISPONIBLES ONLINE",
            tramites: enums.tramites
        })
    });

//ROUTER GENERAL APIS BASICAS
router.use('/:nombreTramite', function (req, res, next) {
    req.session.tramite = req.params.nombreTramite;
    next();
}, routerAlumnoPeticion);

//ROUTER ESPECIFICO
const routes = require('./index');
router.use('/:nombreTramite/especifica', function (req, res, next) {
    req.session.tramite = req.params.nombreTramite;
    next();
});
routes.getRoutersAlumnos()
    .then((routersAlumnos) => {
        for (var i = 0; i < routersAlumnos.length; ++i) {
            router.use('/' + routersAlumnos[i].nombre, routersAlumnos[i].router);
        }
    })

module.exports = router;