const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Permission = dbConnection.define('permissions', {
    posicion: {
        type: DataTypes.INTEGER
    },
    menu: {
        type: DataTypes.STRING
    },
    alias: {
        type: DataTypes.STRING
    },
    roles: {
        type: DataTypes.STRING
    },
    tipo: {
        type: DataTypes.INTEGER
    }
},{
    tableName: 'permissions',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Permission;