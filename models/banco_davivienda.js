const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Banco_daviviendaCont = dbConnection.define('banco_davivienda', {
    id : {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true
    },
    banco: {
        type: DataTypes.STRING
    },
    tipo: {
        type: DataTypes.STRING
    },
    destino: {
        type: DataTypes.STRING
    },
    titular: {
        type: DataTypes.STRING
    },
    valor: {
        type: DataTypes.NUMBER
    },
    fecha: {
        type: DataTypes.STRING
    },
    idmovimiento: {
        type: DataTypes.INTEGER
    },
},{
    tableName: 'banco_davivienda',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Banco_daviviendaCont;