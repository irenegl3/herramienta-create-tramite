#! /usr/bin/env node
if (process.argv.length === 2) {
    console.error('Es necesario indicar el nombre del fichero de configuración\nEjemplo: createEstructuraTramite config.json');
    process.exit(1);
  }
var estructuraTramite = require('../creators/estructuraTramiteCreator');

console.log('Creando estructura tramite..');
let configFileName = process.argv[2];
estructuraTramite.crearEstructuraTramite(configFileName);