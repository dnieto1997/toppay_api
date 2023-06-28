const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const GastosCont = dbConnection.define('gastos', {
    id : {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true
    },
    fecha: {
        type: DataTypes.DATE
    },
    detalle: {
        type: DataTypes.TEXT
    },
    valor: {
        type: DataTypes.NUMBER
    },
    fechasis: {
        type: DataTypes.DATE
    },
    usuario: {
        type: DataTypes.INTEGER
    },
    estado: {
        type: DataTypes.INTEGER
    }
},{
    tableName: 'gastos',
    createdAt: false,
    updatedAt: false
}
);

module.exports = GastosCont;