const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Nequi = dbConnection.define('conf_nequi', {
    id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true
    },
    aliados: {
        type: DataTypes.TEXT
    },
    monto: {
        type: DataTypes.BIGINT
    },
},{
    tableName: 'conf_nequi',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Nequi;