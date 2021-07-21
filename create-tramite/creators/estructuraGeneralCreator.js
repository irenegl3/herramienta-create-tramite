'use strict';


const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const chalk = require('chalk');

const name = 'gestion-tramites-ejemplo';
const root = path.resolve(name);
const version = 'create-tramite@1.1.2';
const verbose = false;
const templateDir = process.cwd() + '/node_modules/create-tramite/userCode';
const pre_root = process.cwd();

var crearEstructuraGeneral = function crearEstructuraGeneral() {
    try {

        // crear directorio ggestion tramites
        fs.ensureDirSync(name);

        // instalar dependencias: create-tramite
        let packageToInstall = version;
        install(root, packageToInstall, verbose)
            .then(() => {
                if (fs.existsSync(templateDir)) {
                    fs.copySync(templateDir, root);
                } else {
                    console.error(
                        `Could not locate supplied template: ${chalk.green(templateDir)}`
                    );
                }
                console.log('Dependencias instaladas.')
            })

    } catch (error) {
        // limpiar directorio
        console.log('Deleting files created...')
        process.chdir(path.resolve(root, '..'));
        fs.removeSync(path.join(root));
        throw error;
    }
}

function install(root, dependencies, verbose) {
    return new Promise((resolve, reject) => {
        let command;
        let args = [];

        args.push('--cwd');
        args.push(root);

        command = 'npm';
        args = [
            'install',
            '--save',
            '--save-exact',
            '--loglevel',
            'error',
        ].concat(dependencies);


        if (verbose) {
            args.push('--verbose');
        }

        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
}

/*
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
            resolve();
        });
    });
}*/

module.exports.crearEstructuraGeneral = crearEstructuraGeneral;