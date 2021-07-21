var inspect = require('util').inspect;
var Busboy = require('busboy');
const axios = require('axios');
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
let planController = require('./../controllers/plan_controller');
let mail = require('./mail.js');

const getModeloPeticion = async function (nombreTramite) {
  try {
    let models = require('./../models/' + nombreTramite + '/index.js').modelosArray;
    let foundModel = models.find(model => model.nombre.startsWith('Peticion'));
    return foundModel.model;
  } catch (error) {
    throw error;
  }
}

const getEstadosTramite = function (nombreTramite) {
  try {
    let estadosOriginal = require('../enums/' + nombreTramite + '/enum.json').estadosTramite;
    var estadosNuevo = {};
    estadosOriginal.forEach(estado => {
      estadosNuevo[[estado.estadoTexto]] = estado.id;
    })
    return estadosNuevo;
  } catch (error) {
    throw error;
  }
}

// CREATE
const createPeticionAlumno = async function (nombreTramite, paramsToCreate) {
  try {
    let modeloPeticion = await getModeloPeticion(nombreTramite);
    let respuesta = await modeloPeticion.create(paramsToCreate);
    return respuesta
  } catch (error) {
    throw error;
  }
}
exports.createPeticionAlumno = async function (req, res, next) {
  try {
    let nombreTramite = req.session.tramite;
    let estadosOriginal = require('../enums/' + nombreTramite + '/enum.json').estadosTramite;
    let paramsToCreate = {
      edupersonuniqueid: req.session.user.edupersonuniqueid,
      email: req.session.user.mailPrincipal,
      nombre: req.session.user.givenname,
      apellido: req.session.user.sn,
      planCodigo: req.body.params.planCodigo,
      planNombre: req.body.params.planNombre,
      estadoPeticion: 1,
      fecha: new Date(),
    };
    let respuesta = await createPeticionAlumno(nombreTramite, paramsToCreate);
    let toAlumno = req.session.user.mailPrincipal;
    let toPAS = process.env.EMAIL_SECRETARIA;
    let from = process.env.EMAIL_SENDER;
    if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
        toAlumno = process.env.EMAIL_PRUEBAS;
        toPAS = process.env.EMAIL_PRUEBAS;
    }
    let mailInfoFromPas = await mail.sendEmail(from, toAlumno, estadosOriginal[0].textoEmailToAlumno, null, estadosOriginal[0].estadoTexto, req.filesBuffer, req.session, nombreTramite)
    let mailInfoFromAlumno = await mail.sendEmail(from, toPAS, estadosOriginal[0].textoEmailToPas, null, estadosOriginal[0].estadoTexto, req.filesBuffer, req.session, nombreTramite)
    res.json(respuesta)
  } catch (error) {
    console.log(error)
    res.json({ error: error.message });
  }
}

// READ
const getAllPeticiones = async function (nombreTramite) {
  try {
    let modeloPeticion = await getModeloPeticion(nombreTramite);
    var { count, rows } = await modeloPeticion.findAndCountAll({});
    let plans = await planController.findAllPlans();
    plans.forEach(plan => {
      if (!plan.nombre) {
        plan.nombre = plan.id;
      }
    })
    rows.forEach(peticion => {
      const plan = plans.find(p => p.id === peticion.planCodigo);
      peticion.planNombre = '';
      if (plan) {
        peticion.planNombre = plan.nombre || '';
      }
    })
    return { numberPeticiones: count, peticiones: rows, plans: plans }
  } catch (error) {
    throw error;
  }
}
exports.getAllPeticiones = async function (req, res, next) {
  try {
    let nombreTramite = req.session.tramite;
    let respuesta = await getAllPeticiones(nombreTramite);
    res.json(respuesta)
  } catch (error) {
    console.log(error)
    res.json({ error: error.message });
  }
}

const getPeticionesByUUID = async function (nombreTramite, edupersonuniqueid) {
  try {
    let modeloPeticion = await getModeloPeticion(nombreTramite);
    let respuesta = await modeloPeticion.findAll({
      where: {
        edupersonuniqueid: edupersonuniqueid
      }
    });
    return respuesta || [];
  } catch (error) {
    throw error;
  }
}
exports.getPeticionByUUID = async function (req, res, next) {
  try {
    let nombreTramite = req.session.tramite;
    let edupersonuniqueid = req.session.user.edupersonuniqueid;
    let respuesta = await getPeticionesByUUID(nombreTramite, edupersonuniqueid);
    res.json(respuesta)
  } catch (error) {
    console.log(error)
    res.json({ error: error.message });
  }
}

const getPeticionById = async function (nombreTramite, id) {
  try {
    let modeloPeticion = await getModeloPeticion(nombreTramite);
    let respuesta = await modeloPeticion.findOne({
      where: {
        id: id
      },
      raw: true
    });
    return respuesta
  } catch (error) {
    throw error;
  }
}
exports.getPeticionById = async function (req, res, next) {
  try {
    let nombreTramite = req.session.tramite;
    let id = req.body.id;
    let respuesta = await getPeticionById(nombreTramite, id);
    res.json(respuesta)
  } catch (error) {
    console.log(error)
    res.json({ error: error.message });
  }
}

// UPDATE
const updatePeticionById = async function (nombreTramite, id, paramsToUpdate) {
  try {
    let modeloPeticion = await getModeloPeticion(nombreTramite);
    let respuesta = await modeloPeticion.update(paramsToUpdate, {
      where: {
        id: id
      },
      returning: true,
    });
    return respuesta
  } catch (error) {
    throw error;
  }
}
exports.updatePeticionById = async function (req, res, next) {
  try {
    let nombreTramite = req.session.tramite;
    let estadosOriginal = require('../enums/' + nombreTramite + '/enum.json').estadosTramite;
    let id = req.body.peticion.id;
    let peticion = await getPeticionById(nombreTramite, id);
    let estadosNuevo = getEstadosTramite(nombreTramite);
    let estadoNuevo;
    let paramsToUpdate = {};
    let emailToAlumno = false;
    let emailToPas = false;
    let contenido ="";
    let textoAdicional=null;
    for(let i = 0; i < estadosOriginal.length; i++ ){
      if(estadosOriginal[i].id == peticion.estadoPeticion){
        if (req.body.cancel) {
          estadoNuevo = -1;
          paramsToUpdate.textCancel = req.body.params.textCancel
          textoAdicional = req.body.params.textCancel
          emailToAlumno = true;
          contenido = estadosOriginal[i].textoEmail;
        } else {
          if(estadosOriginal[i].salidas == null){
            throw "Intenta cambiar un estado que no puede";
          } else{
            estadoNuevo = estadosOriginal[i].salidas[0];
            emailToAlumno = estadosOriginal[i].btnForPas;
            emailToPas = estadosOriginal[i].btnForEstudiantes;
            contenido = estadosOriginal[i+1].textoEmail;
          }
        } 
        break;
      }  
    }
    let toAlumno = peticion.email || req.session.user.mailPrincipal;
    let toPAS = process.env.EMAIL_SECRETARIA;
    let from = process.env.EMAIL_SENDER;
    if (process.env.PRUEBAS == 'true' || process.env.DEV == 'true') {
        toAlumno = process.env.EMAIL_PRUEBAS;
        toPAS = process.env.EMAIL_PRUEBAS;
    }
    let estadoNuevoText = Object.keys(estadosNuevo).find(k => estadosNuevo[k] === estadoNuevo);
    if(emailToAlumno){
      let mailInfoFromPas = await mail.sendEmail(from, toAlumno, contenido, textoAdicional,estadoNuevoText, req.filesBuffer, req.session, nombreTramite)
    }
    if(emailToPas){
      let mailInfoFromAlumno = await mail.sendEmail(from, toPAS, contenido, textoAdicional,estadoNuevoText, req.filesBuffer, req.session, nombreTramite)
    }
    paramsToUpdate.estadoPeticion = estadoNuevo;
    let respuesta = await updatePeticionById(nombreTramite, id, paramsToUpdate);
    res.json(respuesta)
  } catch (error) {
    console.log(error)
    res.json({ error: error.message });
  }
}

// DELETE
const deletePeticionById = async function (nombreTramite, id) {
  try {
    let modeloPeticion = await getModeloPeticion(nombreTramite);
    let respuesta = await modeloPeticion.destroy({
      where: {
        id: id
      },
      returning: true,
    });
    return respuesta
  } catch (error) {
    throw error;
  }
}
exports.deletePeticionById = async function (req, res, next) {
  try {
    let nombreTramite = req.session.tramite;
    //let id = req.body.id;
    let id = '1';
    let respuesta = await deletePeticionById(nombreTramite, id);
    console.log(respuesta);
    res.json(respuesta)
  } catch (error) {
    console.log(error)
    res.json({ error: error.message });
  }
}

const deletePeticionesAntiguas = async function (nombreTramite) {
  try {
    let modeloPeticion = await getModeloPeticion(nombreTramite);
    let respuesta = await modeloPeticion.destroy({
      where: {
        fecha: {
          [Op.lte]: Sequelize.literal("current_date - interval '2 years'")
        }
      },
      returning: true,
    });
    return respuesta
  } catch (error) {
    throw error;
  }
}
exports.deletePeticionesAntiguas = async function (req, res, next) {
  try {
    let nombreTramite = req.session.tramite;
    let respuesta = await deletePeticionesAntiguas(nombreTramite);
    res.json(respuesta)
  } catch (error) {
    console.log(error)
    res.json({ error: error.message });
  }
}

exports.configureMultiPartFormData = async function (req, res, next) {
  req.filesBuffer = [];
  error = false;
  var busboy = new Busboy({
    headers: req.headers,
    limits: {
      files: 2, //limite 2 files
      fileSize: 1024 * 1000 //limite 1MB
    }
  });
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    //se mete en un buffer para pasarlo al correo
    let chunks = []
    if (mimetype !== 'application/pdf') {
      file.resume()
      error = "Sólo se adminten ficheros formato pdf.";
    } else {
      file.on('data', function (data) {
        chunks.push(data);
      });
      file.on('end', function () {
        //comprueba si supero el tamaño el archivo
        if (file.truncated) {
          error = "Como máximo archivos de 1MB.";
        } else {
          req.filesBuffer.push(Buffer.concat(chunks));
          //console.log(req.filesBuffer)
          //si no se mandó fichero no entra aqui
        }
      });
    }

  });
  //recibe aqui los parametros en en multi-part form data por eso se parsean a body
  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    req.body = JSON.parse(val);
  });
  busboy.on('finish', function () {
    if (error) {
      res.status(500).json({ error: error });
    }
    else {
      next()
    }
  });
  req.pipe(busboy);
}

