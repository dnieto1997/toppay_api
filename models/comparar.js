const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Comparar = dbConnection.define('comparar', {
    id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true
    },
    reference: {
        type: DataTypes.STRING
    }
},{
    tableName: 'comparar',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Comparar;