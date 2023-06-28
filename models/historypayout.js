const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const HistoryPayout = dbConnection.define('history_payout', {
    id: {
        type: DataTypes.INTEGER,
        field: 'uid',
        primaryKey: true
    },
    merchant_id: {
        type: DataTypes.INTEGER
    },
    account_id: {
        type: DataTypes.INTEGER
    },
    type_account: {
        type: DataTypes.STRING
    },
    banck: {
        type: DataTypes.STRING
    },
    num_account: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.DECIMAL
    },
    payout: {
        type: DataTypes.DECIMAL
    },
    cashin: {
        type: DataTypes.DECIMAL
    },
    date_create: {
        type: DataTypes.DATE
    },
    user_create: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.CHAR
    }
},{
    tableName: 'history_payout',
    createdAt: false,
    updatedAt: false
}
);

module.exports = HistoryPayout;