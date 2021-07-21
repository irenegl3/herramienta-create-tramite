'use strict';

const fs = require('fs');

function crearModelo(nombreTabla, columnas) {
    let strColumnas = "";
    columnas.forEach(columna =>
        strColumnas +=
        columna.nombreColumna + ": {\n" +
        "type: DataTypes." + columna.tipo.toUpperCase() + ",\n" +
        "primaryKey: " + columna.primaryKey + ",\n" +
        "autoIncrement: " + columna.autoIncrement + ",\n" +
        "},\n"
    );
    let contenido =
        "module.exports = function (sequelize, DataTypes) { \n" +
        "let " + nombreTabla + " = sequelize.define('" + nombreTabla + "',\n" +
        "{\n" +
        strColumnas + "\n" +
        "},{\n" +
        "timestamps: false\n" +
        "});\n" +
        "return " + nombreTabla + ";\n" +
        "};"
        ;

    fs.writeFileSync('./models/' + nombreTabla + '.js', contenido, function (err) {
        if (err) throw err;
    });
    console.log('Modelo ' + nombreTabla + ' creado corrrectamente.');
}

function crearMigracion(nombreTabla, columnas) {
    let currentdate = new Date();
    let fechaHoraMigracion = "" + currentdate.getFullYear() + (currentdate.getMonth() + 1) + currentdate.getDate() + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds() + "";
    let strColumnas = "";
    columnas.forEach(columna =>
        strColumnas +=
        columna.nombreColumna + ": {\n" +
        "type: Sequelize." + columna.tipo.toUpperCase() + ",\n" +
        "primaryKey: " + columna.primaryKey + ",\n" +
        "autoIncrement: " + columna.autoIncrement + ",\n" +
        "},\n"
    );
    let contenido =
        "'use strict';\n" +
        "module.exports = {\n" +
        "up: (queryInterface, Sequelize) => {\n" +
        "return queryInterface.createTable('" + nombreTabla + "s', {\n" +
        strColumnas + "\n" +
        "},{\n" +
        "timestamps: false\n" +
        "});\n" +
        "},\n" +
        "down: (queryInterface, Sequelize) => {\n" +
        "return queryInterface.dropTable('" + nombreTabla + "s')\n" +
        "}\n" +
        "};"
        ;

    fs.writeFileSync("./migrations/" + fechaHoraMigracion + "-Create" + nombreTabla + "sTable.js", contenido, function (err) {
        if (err) throw err;
    });
    console.log('Migración ' + nombreTabla + ' creada corrrectamente.');
}

function crearIndex(modelRequires, modelExports) {
    let contenido =
        "let Sequelize = require('sequelize');\n" +
        "let logs = process.env.DEV === 'true' ? false : false \n" +
        "let sequelize;\n\n" +
        "sequelize = new Sequelize('postgres://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':5432/' + process.env.POSTGRES_DB, { logging: logs });\n\n" +
        modelRequires + "\n" +
        "(async () => {\n" +
        "try {\n" +
        "// En producción ya no sincronizar, hacer mejor migraciones\n" +
        "await sequelize.sync();\n" +
        "await sequelize.authenticate();\n" +
        "console.log('Connected to the database')\n" +
        "// actualizar o crear planes\n" +
        "await planController.createOrUpdatePlans();\n" +
        "// extension unaccent\n" +
        "try {\n" +
        "await sequelize.query('CREATE EXTENSION unaccent;')\n" +
        "} catch (error) {\n" +
        "console.log(error.message);\n" +
        "}\n" +
        "} catch (error) {\n" +
        "console.log(error);\n" +
        "}\n" +
        "})();\n\n" +
        "//Exportamos modelos\n" +
        modelExports.toString() + "\n" +
        "exports.sequelize = sequelize;";

    fs.writeFileSync("./models/index.js", contenido, function (err) {
        if (err) throw err;
    });
    console.log('Index creado corrrectamente.');
}

var crearBaseDeDatos = function () {

    let rawdata = fs.readFileSync(process.cwd()+'/config.json');
    let configFile = JSON.parse(rawdata);

    let tablas = configFile.baseDatos.tablas;
    let nombreTramite = configFile.nombreTramite;
    var modelRequires = "";
    var modelExports = "";

    // Para cada tabla definida en json, crea el modelo, el fichero de migacion correspondiente, los requires y los exports
    tablas.forEach(
        function (tabla) {
            crearModelo(tabla.nombreTabla, tabla.columnas)
            crearMigracion(tabla.nombreTabla, tabla.columnas)
            modelRequires += "let " + tabla.nombreTabla + " = require('./" + tabla.nombreTabla + "')(sequelize, Sequelize);\n";
            modelExports += "exports." + tabla.nombreTabla + " = " + tabla.nombreTabla + ";\n";
        }, this);

    crearIndex(modelRequires, modelExports);
}

module.exports.crearBaseDeDatos = crearBaseDeDatos;

