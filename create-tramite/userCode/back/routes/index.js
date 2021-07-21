let tramites = require('./../enums').tramites;

exports.getRoutersPas =async function (){
    var routersPas = [];
    tramites.forEach((tramite)=>{
        let routerTramitePas = {};
        routerTramitePas.nombre = tramite[0];
        routerTramitePas.router = require('./' + tramite[0] + '/routerPas');
        routersPas.push(routerTramitePas);
    })
    return routersPas;
}

exports.getRoutersAlumnos = async function (){
    var routersAlumnos = [];
    tramites.forEach((tramite)=>{
        let routerTramiteAlumno = {};
        routerTramiteAlumno.nombre = tramite[0];
        routerTramiteAlumno.router = require('./' + tramite[0] + '/routerAlumno');
        routersAlumnos.push(routerTramiteAlumno);
    })
    return routersAlumnos;
}     
