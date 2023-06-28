const { response, json } = require('express');
const { Usuario } = require('../models');
const bcryptjs = require('bcryptjs');
const { genererJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {
    
    const { user, password } = req.body;

    
    try {
        
        //verificar si el correo existe
       // const usuario = await Usuario.findOne({ user });
        const usuario = await Usuario.findOne({
            where: {
                log_usuario: user
            }
        });
      
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos',
                status: 0
            });
        }   
        
        ///usuario activo
        if( usuario.log_estado != 1 ){
            return res.status(400).json({
                msg: 'Contacte al aministrador',
                status: 0
            });
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.log_clave);

        if( !validPassword ){

            return res.status(400).json({
                msg: 'Usuario/Password no son correctos',
                status: 0
            });

        }

        //generear jwt
        const token = await genererJWT ( usuario.id );

        res.json({
           token,
           status: 1
        }); 

    } catch (error) {

        res.status(500).json({
            msg: 'Hable con el administrador',
            status: 0
        });

    }

}

const change = async (req, res = response) => {

    const { passv, passn } = req.body;
    const { id,log_clave  } = req.usuario;

    try {
        
        const validPassword = bcryptjs.compareSync(passv, log_clave);
    
        if(!validPassword){
    
            return res.status(400).json({
                msg: 'El Password no es correctos',
                status: 1
            }); 
        }
    
        const salt = bcryptjs.genSaltSync();
        const password = bcryptjs.hashSync ( passn, salt );
    
        const usuario= req.usuario;
    
        await usuario.update({
            id : id,
            log_clave:password
        });
        
        res.json({
            msg: 'Cambio de contraseña exitoso',
            result:usuario,
            status: 1
         }); 

    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador',
            status: 1
        });
    }
}

module.exports = {
    login,
    change
}