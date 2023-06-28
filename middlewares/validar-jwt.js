const { response } = require("express");
const  jwt  = require("jsonwebtoken");
const { Usuario } = require('../models');

const validarJWT = async(req, res = response, next) => {

    const token = req.header('x-token');
   
    if( !token ){

        return res.status(401).json({
            msg: 'No hay token en la peticion',
            status: 0
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //leer usuario q correstopen al uid
        const usuario = await Usuario.findByPk( uid );

        
        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no valido -Usuario no existe DB',
                status: 0
            });
        }
        
        //verificar uid esta estado true
        if( usuario.log_estado != 1 ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario estado false',
                status: 0
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        
        res.status(401).json({
            msg: 'Token no valido',
            status: 0
        })
    }

}

module.exports = {
    validarJWT
}