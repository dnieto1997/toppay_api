const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Aliados = dbConnection.define('aliado', {
    id: {
        type: DataTypes.INTEGER,
        field: 'uid',
        primaryKey: true
    },
    token: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    merchant: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    url_response: {
        type: DataTypes.STRING
    },
    pse_fijo: {
        type: DataTypes.DECIMAL
    }, 
    pse_porcentaje: {
        type: DataTypes.DECIMAL
    },
    nequi_fijo: {
        type: DataTypes.DECIMAL
    },
    nequi_porcentaje: {
        type: DataTypes.DECIMAL
    },
    cashout: {
        type: DataTypes.DECIMAL
    },
    banco: {
        type: DataTypes.INTEGER
    },
    wallet_cashin: {
        type: DataTypes.DECIMAL
    },
    wallet_cashout: {
        type: DataTypes.DECIMAL
    },
    iva: {
        type: DataTypes.DECIMAL
    },
    pais: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.INTEGER
    }, 
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }   
},{
    tableName: 'aliado',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Aliados;