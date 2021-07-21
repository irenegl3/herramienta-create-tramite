var inspect = require('util').inspect;
var Busboy = require('busboy');
const axios = require('axios');
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

let models = require('../../models/nombreTramite');