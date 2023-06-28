const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const MasivaCont = dbConnection.define('masiva', {
    id : {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true
    },
    reference: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER
    },
    usuario: {
        type: DataTypes.INTEGER
    },
    msg: {
        type: DataTypes.INTEGER
    },
    fecha: {
        type: DataTypes.DATE
    },
    cost: {
        type: DataTypes.DECIMAL
    },  
    iva: {
        type: DataTypes.DECIMAL
    },  
    motivo: {
        type: DataTypes.TEXT
    },
    url_response: {
        type: DataTypes.TEXT
    },
    currency: {
        type: DataTypes.TEXT
    },
    amount: {
        type: DataTypes.TEXT
    }
},{
    tableName: 'masiva',
    createdAt: false,
    updatedAt: false
}
);

module.exports = MasivaCont;