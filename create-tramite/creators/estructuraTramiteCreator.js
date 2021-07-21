'use strict';

const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const { config, env } = require('process');


const name = 'gestion-tramites-ejemplo';
const root = path.resolve(name);
const appName = path.basename(root);
const version = 'create-tramite@1.1.2';
const verbose = false;
const templateDir = process.cwd() + '/node_modules/create-tramite/templates';
const pre_root = process.cwd();

async function crearRouter(nombreTramite, descripcionTramite, contexto) {
    let contextoUpperCase = contexto.charAt(0).toUpperCase() + contexto.slice(1);
    try {
        fs.readFile(process.cwd() + '/node_modules/create-tramite/templates/back/router' + contextoUpperCase + '.js', 'utf8')
            .then(data => {
                var result = data.replace(/nombreTramite/g, nombreTramite);
                fs.outputFile('./routes/' + nombreTramite + '/router' + contextoUpperCase + '.js', result, 'utf8')
            })
    } catch (error) {
        throw error;
    }
}
async function crearComponentesFront(nombreTramite, estados) {
    try {
        fs.copy(process.cwd() + '/node_modules/create-tramite/templates/front', path.join(root, '/front/app/components/' + nombreTramite))
            .then(() => {
                fs.readFile(path.join(root, 'front/app/components/' + nombreTramite + '/estudiantes/Tramite.jsx'), 'utf8')
                    .then((data) => {
                        let acciones = writeAccionesTramites(estados, "btnForEstudiantes");
                        var result = data.replace('//ACCION_ESTUDIANTES', acciones);
                        fs.outputFile(path.join(root, 'front/app/components/' + nombreTramite + '/estudiantes/Tramite.jsx'), result, 'utf8')
                    })
                fs.readFile(path.join(root, 'front/app/components/' + nombreTramite + '/pas/Tramite.jsx'), 'utf8')
                    .then((data) => {
                        let acciones = writeAccionesTramites(estados, "btnForPas");
                        var result = data.replace('//ACCION_PAS', acciones);
                        fs.outputFile(path.join(root, 'front/app/components/' + nombreTramite + '/pas/Tramite.jsx'), result, 'utf8')
                        .then(()=>{
                            fs.readFile(path.join(root, 'front/app/components/' + nombreTramite + '/pas/Tramite.jsx'), 'utf8')
                            .then((data) => {
                                let cancelables = writeCancelablesTramites(estados, 'btnForPas');
                                var result = data.replace('//ACCION_2', cancelables);
                                fs.outputFile(path.join(root, 'front/app/components/' + nombreTramite + '/pas/Tramite.jsx'), result, 'utf8')
                            })
                        })                
                    })
                fs.readFile(path.join(root, 'front/app/components/' + nombreTramite + '/estudiantes/ModalStructure.jsx'), 'utf8')
                .then((data) => {
                    let acciones = writeAccionesModalStructure(estados, "btnForEstudiantes");
                    var result = data.replace('//TODO', acciones);
                    fs.outputFile(path.join(root, 'front/app/components/' + nombreTramite + '/estudiantes/ModalStructure.jsx'), result, 'utf8')             
                })
                fs.readFile(path.join(root, 'front/app/components/' + nombreTramite + '/pas/ModalStructure.jsx'), 'utf8')
                .then((data) => {
                    let acciones = writeAccionesModalStructure(estados, "btnForPas");
                    var result = data.replace('//TODO', acciones);
                    fs.outputFile(path.join(root, 'front/app/components/' + nombreTramite + '/pas/ModalStructure.jsx'), result, 'utf8')             
                })
                fs.readFile(path.join(root, 'front/app/components/' + nombreTramite + '/pas/App.jsx'), 'utf8')
                .then((data) => {
                    var result = data.replace('nombreTramite', '"'+nombreTramite+'"');
                    fs.outputFile(path.join(root, 'front/app/components/' + nombreTramite + '/pas/App.jsx'), result, 'utf8')             
                })
                fs.readFile(path.join(root, 'front/app/components/' + nombreTramite + '/estudiantes/App.jsx'), 'utf8')
                .then((data) => {
                    var result = data.replace('nombreTramite', '"'+nombreTramite+'"');
                    fs.outputFile(path.join(root, 'front/app/components/' + nombreTramite + '/estudiantes/App.jsx'), result, 'utf8')             
                })
            })
    } catch (error) {
        throw error;
    }
}

function writeAccionesTramites(estados, contexto) {
    let result = "switch (estadosNuevo[row.estadoPeticionTexto]) {\n";
    estados.forEach(estado => {
        if (estado[contexto] == true) {
            result += 'case estadosNuevo.' + estado["estadoTexto"] + ':\n     return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false)}>'+estado["nombreBoton"]+'</Button>)\n';
        }
    })
    let defecto = (contexto == "btnForEstudiantes") ? "Su solicitud está siendo procesada por secretaría." : "No acción asociada."
    result += 'default:\n    return (<span>' + defecto + '</span>)\n }';
    return result;
}

function writeCancelablesTramites(estados, contexto) {
    let result = "switch (row.estadoPeticion) {\n";
    estados.forEach(estado => {
        if (estado[contexto] == true && estado['cancelable'] == true) {
            result += 'case estadosNuevo.' + estado["estadoTexto"] + ':\n     return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla,true, false)}>Cancelar</Button>)\n';
        }
    })
    result += 'default:\n    return (<span>No acción asociada</span>)\n }';
    return result;
}
function writeAccionesModalStructure(estados, contexto) {
    let result = "else {\n switch (estadosNuevo[this.props.peticion.estadoPeticionTexto]) {\n";
    let exists = false;
    estados.forEach(estado => {
        if (estado[contexto] == true) {
            exists = true;
            result += 'case estadosNuevo.' + estado["estadoTexto"] + ':\n     form = <SuperModal peticion={this.props.peticion} handleClose={this.handleClose} cambioEstadoClick={this.cambioEstadoClick} descripcion={"'+estado["descripcionModal"]+'"}> </SuperModal>\n';
        }
    })
    result += 'default: break; \n }}';
    let res = exists ? result : "";
    return res;
}

async function crearController(nombreTramite) {
    try {
        fs.readFile(process.cwd() + '/node_modules/create-tramite/templates/back/peticion_controller.js', 'utf8')
            .then(data => {
                var result = data.replace(/nombreTramite/g, nombreTramite);
                fs.outputFile('./controllers/' + nombreTramite + '/peticion_controller.js', result, 'utf8')
            })
    } catch (error) {
        throw error;
    }
}

async function crearModelIndex(nombreTramite) {
    try {
        fs.copy(process.cwd() + '/node_modules/create-tramite/templates/back/index_model.js', path.join(root, '/back/models/' + nombreTramite + '/index.js'))
    } catch (error) {
        throw error;
    }
}

async function añadirTramite(nombreTramite, descripcionTramite) {
    let añadido = '["' + nombreTramite + '","' + descripcionTramite + '"],\n];';
    try {
        fs.readFile(path.join(root, 'back/enums/index.js'), 'utf8')
            .then(data => {
                var result = data.replace("];", añadido);
                fs.outputFile('./enums/index.js', result, 'utf8')
            })
    } catch (error) {
        throw error;
    }
}

var crearEstructuraTramite = async function crearEstructuraTramite(configFileName) {
    let rawdata = fs.readFileSync(process.cwd() + '/' + configFileName);
    let configFile = JSON.parse(rawdata);
    let nombreTramite = configFile.nombreTramite;
    let descripcionTramite = configFile.descripcionTramite;
    let tablas = configFile.baseDatos.tablas;
    let estados = configFile.estadosTramite;
    try {

        // crear controllers de tramite en /controllers
        let controllerDir = name + '/back/controllers/' + nombreTramite;
        fs.ensureDirSync(controllerDir);
        crearController(nombreTramite);

        // crear js de bundle en /public/js
        let publicDir = name + '/back/public/js/' + nombreTramite;
        fs.ensureDirSync(publicDir);

        // crear routes de tramite en /routes
        let routerDir = name + '/back/routes/' + nombreTramite;
        fs.ensureDirSync(routerDir);
        crearRouter(nombreTramite, descripcionTramite, 'Alumno');
        crearRouter(nombreTramite, descripcionTramite, 'Pas');

        // enum de tramite (config.json)
        let routerEnum = name + '/back/enums/' + nombreTramite;
        fs.ensureDirSync(routerEnum);
        fs.copy(path.join(process.cwd(), configFileName), path.join(root, '/back/enums', nombreTramite, 'enum.json'));
        // añadir tramite a enum/index
        añadirTramite(nombreTramite, descripcionTramite);

        // crear front de tramite
        let routerFront = name + '/front/app/components/' + nombreTramite;
        fs.ensureDirSync(routerFront);
        crearComponentesFront(nombreTramite, estados);
        let envData = "SERVICE=http://localhost:3000 \nTRAMITE=" + nombreTramite.toLowerCase();
        fs.outputFile(path.join(root, '/front/.env'), envData);
        let text = "\nlet " + nombreTramite.toLowerCase() + "= require('./" + nombreTramite.toLowerCase() + "');\nexports." + nombreTramite.toLowerCase() + " = " + nombreTramite.toLowerCase() + ";";
        fs.appendFile(path.join(root, '/front/app/components/index.jsx'), text);

        // crear migraciones y models en /db
        let routerModel = name + '/back/models/' + nombreTramite;
        fs.ensureDirSync(routerModel);
        crearModelIndex(nombreTramite);
        let promisesDB = [];
        tablas.forEach(tabla => {
            let atributos = [];
            let columnas = tabla.columnas;
            columnas.forEach(columna => {
                let atributo = [];
                atributo[0] = columna.nombreColumna;
                atributo[1] = columna.tipo;
                atributos.push(atributo)
            })
            let nombreTabla = "Peticion" + nombreTramite;
            promisesDB.push(crearMigracion(nombreTabla, atributos));
        })
        Promise.all(promisesDB).then((nombres) => {
            nombres.forEach((modelo) => {
                let modeloLowerCase = modelo.toLowerCase();
                fs.move(name + '/back/models/' + modeloLowerCase + '.js', name + '/back/models/' + nombreTramite + '/' + modelo + '.js')
            })
            console.log('Estructura de ' + nombreTramite + ' creada.')
        })

        // fs.copyFile(process.cwd()+'/node_modules/create-tramite/templates/.env', '.env', (err) => {
        //     if (err) throw err;
        // });
        // fs.copyFile(process.cwd()+'/node_modules/create-tramite/templates/nombre-tramite-db.env', './' + nombreTramite + '-db.env', (err) => {
        //     if (err) throw err;
        // });

    } catch (error) {
        //console.error(error.name +': '+error.message);
        // limpiar directorio
        // console.log('Deleting files created...')
        // process.chdir(path.resolve(root, '..'));
        // fs.removeSync(path.join(root));
        console.log(error);
        throw error;
    }
}

function crearMigracion(nombre, atributosArray) {
    return new Promise((resolve, reject) => {
        let command;
        let args = [];
        let atributosString = "";
        atributosArray.forEach((atributo, index, array) => {
            if (index === (array.length - 1)) {
                atributosString += (atributo[0] + ':' + atributo[1]);
            } else {
                atributosString += (atributo[0] + ':' + atributo[1] + ',');
            }
        });
        // atributosArray.forEach(atributo => {
        //     atributosString += (atributo[0] + ':' + atributo[1] + ',');
        // });
        // atributosString += 'tramite:string';
        process.chdir(path.join(root, 'back'));
        command = 'npx';
        args = [
            'sequelize-cli',
            'model:generate',
            '--name',
            nombre,
            '--attributes',
            atributosString
        ];

        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            process.chdir(pre_root);
            resolve(nombre);
        });
    });
}

function crearSeeder(nombreTabla, nombreTramite) {
    return new Promise((resolve, reject) => {
        let currentdate = new Date();
        let fechaHoraSeeder = "" + currentdate.getFullYear() + (currentdate.getMonth() + 1) + currentdate.getDate() + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds() + "";
        let contenido =
            "'use strict';\n" +
            "const { UniqueConstraintError } = require('sequelize'); \n" +
            "module.exports = {\n" +
            "up: async queryInterface => {\n" +
            "try { \n" +
            "await queryInterface.bulkInsert('" + nombreTabla + "s', [\n" +
            "{\n" +
            "tramite: '" + nombreTramite + "',\n" +
            "createdAt: new Date(),\n" +
            "updatedAt: new Date() \n" +
            "}]);\n" +
            "} catch (error) { \n" +
            "if (error instanceof UniqueConstraintError) { \n" +
            "console.warn('Tramite ya insertado'); \n" +
            "} else { \n" +
            " console.error(error); \n" +
            "}} \n" +
            "},\n" +
            "down: (queryInterface, Sequelize) => {\n" +
            "return queryInterface.bulkDelete('" + nombreTabla + "s', null, {}); \n" +
            "}\n" +
            "};"
            ;
        process.chdir(path.join(root, 'back/db/seeders'));
        fs.writeFileSync(fechaHoraSeeder + "-" + nombreTabla + "s.js", contenido, function (err) {
            if (err) throw err;
        });
        console.log('Seeder ' + nombreTabla + ' creado corrrectamente.');
        resolve();
    })
}

function añadirAsociacion(nombreTabla) {
    return new Promise((resolve, reject) => {
        let currentdate = new Date();
        let fechaHoraMigracion = "" + currentdate.getFullYear() + (currentdate.getMonth() + 1) + currentdate.getDate() + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds() + "";
        let contenido =
            "'use strict';\n" +
            "module.exports = {\n" +
            "up: async (queryInterface, Sequelize) => {\n" +
            "const t = await queryInterface.sequelize.transaction(); \n" +
            "try { \n" +
            "await queryInterface.addColumn('" + nombreTabla + "s', \n" +
            "'tramiteId',\n" +
            "{\n" +
            "type: Sequelize.INTEGER,\n" +
            "references:{ \n" +
            "model:'TramitesDisponibles', \n" +
            "key:'id' \n" +
            "}, \n" +
            "onUpdate: 'CASCADE', \n" +
            "onDelete: 'SET NULL' \n" +
            "},\n" +
            " { transaction: t }) \n" +
            " await t.commit(); \n" +
            "} catch (error) { \n" +
            " console.error(error); \n" +
            "if (t) {await t.rollback();} \n" +
            "} \n" +
            "},\n" +
            "down: async (queryInterface, Sequelize) => {\n" +
            " const t = await queryInterface.sequelize.transaction(); \n" +
            "try { \n" +
            "await queryInterface.removeColumn('" + nombreTabla + "', 'tramiteId', { transaction: t }); \n" +
            "await t.commit(); \n" +
            "} catch (error) { \n" +
            " console.error(error); \n" +
            "if (t) {await t.rollback();} \n" +
            "} \n" +
            "}\n" +
            "};"
            ;
        process.chdir(path.join(root, 'back/db/migrations'));
        fs.writeFileSync(fechaHoraMigracion + "-AddAsociacion" + nombreTabla + "s.js", contenido, function (err) {
            if (err) throw err;
        });
        console.log('Migracion asociación de ' + nombreTabla + ' creado corrrectamente.');
        resolve();
    })
}

module.exports.crearEstructuraTramite = crearEstructuraTramite;