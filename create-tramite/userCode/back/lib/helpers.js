
// Devuelve el numero positivo de una o dos cifras con dos cifras
// ejemplos 9 -> 09; 20 -> 20
function twoDigitsNumber(number) {
    return ("0" + number).slice(-2);
}

//Devuelve curso en forma 2018-19
//Ejemplo anio 2018
//si es antes de septiembre del anio y devuelve el curso y 2017-18
// si es despues de agosto devuelve el curso 2018-19
function getCursoAnio() {
    const now = new Date();
    const previousYear = now.getFullYear() - 1;
    const yearTwoDigits = twoDigitsNumber(Number(now.getFullYear().toString().substr(2, 2)));
    const nextYearTwoDigits = twoDigitsNumber(Number(yearTwoDigits) + 1);
    if (now.getMonth() < 7) {
        return `${previousYear}-${yearTwoDigits}`;
    } else {
        return `${now.getFullYear()}-${nextYearTwoDigits}`;
    }
};

// convierte de YYYY-MM-DD a DD/MM/YYYY
const formatFecha = fecha => {
    try {
      return `${fecha.split('-')[2]}-${fecha.split('-')[1]}-${
        fecha.split('-')[0]
      }`;
    } catch (error) {
      return null;
    }
  };


exports.ensureDirectoryExistence = function probar(filePath, notCreate) {
    const dirname = path.dirname(filePath);
    // sync para evitar condiciones de bloqueo
    if (fs.existsSync(dirname)) {
      return;
    }
    if (notCreate) {
      return;
    }
    probar(dirname);
    fs.mkdirSync(dirname);
  };
  

module.exports = {
    getCursoAnio,
    formatFecha
}
