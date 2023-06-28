const { response, json } = require('express');
const { Permission } = require('../models');
const { genererJWT } = require('../helpers/generar-jwt');
const { dbConnection } = require('../database/config');

const menu = async (req, res = response) => {

    const { log_tipo, log_usuario, log_pais } = req.usuario;

    try {
        
        const permisos = await Permission.findAll({
            order: [
                ['posicion', 'ASC'],
            ]
        });
       
        return res.json({
            result: permisos,
            tipo: log_tipo,
            usuario: log_usuario,
            pais: log_pais,
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
    menu
}