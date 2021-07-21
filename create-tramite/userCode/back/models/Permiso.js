// Definicion del modelo Permiso:

module.exports = function (sequelize, DataTypes) {
    let Permiso = sequelize.define('Permiso',
        {
            email: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            tramite: {
                type: DataTypes.STRING,
                primaryKey: true
            },
        },
        {
            timestamps: false
        });
    return Permiso;
};
