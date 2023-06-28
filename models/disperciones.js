const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Dispersiones = dbConnection.define('dispersiones', {
    merchant: {
        type: DataTypes.INTEGER
    },
    fechainicio: {
        type: DataTypes.DATE
    },
    fechafin: {
        type: DataTypes.DATE
    },
    fechapago: {
        type: DataTypes.DATE
    },
    banco: {
        type: DataTypes.STRING
    },
    cuenta: {
        type: DataTypes.STRING
    },
    valor: {
        type: DataTypes.DECIMAL
    },
    tipo: {
        type: DataTypes.CHAR
    },
    gmf: {
        type: DataTypes.BIGINT
    },
    pais: {
        type: DataTypes.INTEGER
    },
    estado: {
        type: DataTypes.CHAR
    },
},{
    tableName: 'dispersiones',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Dispersiones;