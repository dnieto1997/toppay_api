const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config')

const Usuario = dbConnection.define('login_dash', {
    id : {
        type: DataTypes.INTEGER,
        field: 'log_id',
        primaryKey: true
    },
    log_merchantid: {
        type: DataTypes.STRING
    },
    log_usuario: {
        type: DataTypes.STRING
    },
    log_clave: {
        type: DataTypes.STRING
    },
    log_tipo: {
        type: DataTypes.STRING
    },
    cashout: {
        type: DataTypes.DECIMAL
    },
    log_pais: {
        type: DataTypes.INTEGER
    },
    log_estado: {
        type: DataTypes.CHAR
    }
},{
    tableName: 'login_dash',
    createdAt: false,
    updatedAt: false
}
);

module.exports = Usuario;