const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Aliado } = require('../models');
const moment = require('moment'); 

const importarReferencia = async (req, res = response) => {


    try {
      
        return res.json({
            result: 'aliados',
            status: 1
        });

    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}


module.exports = {
    importarReferencia
}