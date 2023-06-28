const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const MovimientoEstado = dbConnection.define('movimiento_user', {
    user: {
        type: DataTypes.NUMBER
    },
    movimiento: {
        type: DataTypes.NUMBER
    },
    date: {
        type: DataTypes.DATE
    },
    tipo: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.NUMBER
    }   
},{
    tableName: 'movimiento_user',
    createdAt: false,
    updatedAt: false
}
);

module.exports = MovimientoEstado;