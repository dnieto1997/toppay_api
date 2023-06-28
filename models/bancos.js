const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Bancos = dbConnection.define('bancos', {
    nombre: {
        type: DataTypes.STRING
    },
    cuenta: {
        type: DataTypes.STRING
    },
    merchant: {
        type: DataTypes.INTEGER
    }
},{
    tableName: 'bancos',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Bancos;