'use strict';
let fs = require('fs-extra');
var modelosArray = [];

exports.cargaModelos = async function (nombreTramite, sequelize, Sequelize) {
    let rawdata = fs.readFileSync(process.cwd()+'/enums/'+nombreTramite+'/enum.json');
    let configFile = JSON.parse(rawdata);
    let tablas = configFile.baseDatos.tablas;
    tablas.forEach((tabla)=>{
        let modelo = {};
        let nombreTabla = tabla.nombreTabla;
        modelo.nombre = nombreTabla;
        modelo.model = require('./'+nombreTabla)(sequelize, Sequelize);
        modelosArray.push(modelo);
    })
};

exports.modelosArray = modelosArray;