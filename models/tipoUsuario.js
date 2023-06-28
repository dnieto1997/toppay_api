const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const TipoUser = dbConnection.define('tipo_user', {
    descripcion: {
        type: DataTypes.STRING
    },
    nombre: {
        type: DataTypes.STRING
    }
},{
    tableName: 'tipo_user',
    createdAt: false,
    updatedAt: false
}
);

module.exports = TipoUser;