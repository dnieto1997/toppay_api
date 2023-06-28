const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Wallets = dbConnection.define('wallets', {
    id: {
        type: DataTypes.INTEGER,
        field: 'uid',
        primaryKey: true
    },
    merchant_id: {
        type: DataTypes.INTEGER
    },
    alias: {
        type: DataTypes.STRING
    },
    num_account: {
        type: DataTypes.STRING
    },
    type_account: {
        type: DataTypes.CHAR
    },
    amount: {
        type: DataTypes.DECIMAL
    },
    status: {
        type: DataTypes.CHAR
    }
},{
    tableName: 'wallets',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Wallets;