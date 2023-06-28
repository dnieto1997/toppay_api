const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const LogsCallbacks = dbConnection.define('logs_callbacks', {
    id : {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true
    },
    referenceid: {
        type: DataTypes.INTEGER
       
    },
    reference: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.STRING
    },
    method: {
        type: DataTypes.STRING
    },
    user_created: {
        type: DataTypes.STRING
    },
    date_notify: {
        type: DataTypes.STRING
    },
    error_at: {
        type: DataTypes.STRING
    },
    merchant_id: {
        type: DataTypes.STRING
    },
    merchant_name: {
        type: DataTypes.STRING
    },
    currency: {
        type: DataTypes.STRING
    },
    url_callback: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    motivo: {
        type: DataTypes.STRING
    },
    upload_support: {
        type: DataTypes.STRING
    },
    json: {
        type: DataTypes.STRING
    },
    last_uploadsupport: {
        type: DataTypes.STRING
    }
   
},{
    tableName: 'logs_callbacks',
    createdAt: false,
    updatedAt: false
}
);

module.exports = LogsCallbacks;