const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Movimientos = dbConnection.define('movimientos', {
    id : {
        type: DataTypes.INTEGER,
        field: 'uid',
        primaryKey: true
    },
    reference: {
        type: DataTypes.STRING
    },
    reference_pro: {
        type: DataTypes.INTEGER
    },
    reference_pro2: {
        type: DataTypes.STRING
    },
    checkout: {
        type: DataTypes.TEXT
    },
    merchant_id: {
        type: DataTypes.INTEGER
    },
    merchant_email: {
        type: DataTypes.STRING
    },
    merchant_phone: {
        type: DataTypes.STRING
    },
    merchant_logo: {
        type: DataTypes.STRING
    },
    merchant_name: {
        type: DataTypes.STRING
    },
    expiration: {
        type: DataTypes.DATE
    },
    currency: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.STRING
    },
    user_doc: {
        type: DataTypes.STRING
    },
    user_type: {
        type: DataTypes.STRING
    },
    user_name: {
        type: DataTypes.STRING
    },
    user_phone: {
        type: DataTypes.STRING
    },
    user_email: {
        type: DataTypes.STRING
    },
    user_address: {
        type: DataTypes.STRING
    },
    user_typeuser: {
        type: DataTypes.STRING
    },
    type_transaction: {
        type: DataTypes.CHAR
    },
    method: {
        type: DataTypes.STRING
    },
    cost: {
        type: DataTypes.DECIMAL
    },
    iva: {
        type: DataTypes.DECIMAL
    },
    user_bank: {
        type: DataTypes.STRING
    },
    user_type_account: {
        type: DataTypes.STRING
    },
    user_num_account: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER
    },
    linkpro: {
        type: DataTypes.TEXT
    },
    notify: {
        type: DataTypes.STRING
    },
    pagado: {
        type: DataTypes.CHAR
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }
   
},{
    tableName: 'movimientos',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Movimientos;