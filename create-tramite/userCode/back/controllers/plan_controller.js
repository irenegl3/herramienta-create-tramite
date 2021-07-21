const axios = require('axios');
const modelosArray = require('../models').modelosArray;
const models = require('../models');


async function createOrUpdatePlans() {
    const promises = [];
    try {
        const plans = await getPlansApiUpm();
        plans.data.forEach(plan => {
            promises.push(
                models.Plan.upsert({
                    id: plan.codigo,
                    nombre: plan.nombre
                })
            )
        });
        await Promise.all(promises);
    } catch (error) {
        // no haces un next(error) pq quieres que siga funcionando aunque api upm falle en este punto
        console.log('Error:', error);
    }
};

async function getPlansApiUpm() {
    try {
        return await axios.get(
            'https://www.upm.es/wapi_upm/academico/comun/index.upm/v2/centro.json/9/planes/PSC'
        );
    } catch (error) {
        // no se propaga el error porque puede haber fallos en api upm y esta no es critica
        console.log(error);
        return { data: [] };
    }
};

async function findAllPlans() {
    try {
        return await models.Plan.findAll({
            order: [
                ['nombre', 'ASC'],
            ],
        });
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getName(id) {
    try {
        let nombrePlan = await models.Plan.findOne({
            attributes: ['nombre'],
            where: {
                id: id
            }
        });
        return nombrePlan.nombre;
    } catch (error) {
        console.log(error);
        return [];
    }
}

exports.createOrUpdatePlans = createOrUpdatePlans;
exports.findAllPlans = findAllPlans;
exports.getName = getName;