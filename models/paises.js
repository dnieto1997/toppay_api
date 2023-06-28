const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Pais = dbConnection.define('pais', {
    id: {
        type: DataTypes.INTEGER,
        field: 'uid',
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING
    }   
},{
    tableName: 'pais',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Pais;