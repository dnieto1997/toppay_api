const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const ListaNegra = dbConnection.define('lista_negra', {
    id : {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true
    },
    cedula: {
        type: DataTypes.STRING
    },
    fecha: {
        type: DataTypes.DATE
    }
},{
    tableName: 'lista_negra',
    createdAt: false,
    updatedAt: false
}
);

module.exports = ListaNegra;