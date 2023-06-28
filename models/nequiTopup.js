const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const nequiTopup = dbConnection.define('nequi_topup', {
    id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true
    },
    respuesta: {
        type: DataTypes.TEXT
    },
    fecha: {
        type: DataTypes.DATE
    },
    referencia: {
        type: DataTypes.STRING
    },
    respaliado: {
        type: DataTypes.TEXT
    },
},{
    tableName: 'nequi_topup',
    createdAt: false,
    updatedAt: false
}
);

module.exports = nequiTopup;