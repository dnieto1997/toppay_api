const { response } = require('express');
const { dbConnection } = require('../database/config');
const { Usuario,TipoUser } = require('../models');
const bcriptjs = require('bcryptjs');

const verUsuario = async (req, res = response) => {

    try {
        
        const usuarios = await dbConnection.query(`SELECT   l.log_id AS id,
                                                            l.log_merchantid,
                                                            l.log_usuario,
                                                            l.log_tipo,
                                                            l.log_estado,
                                                            l.log_pais,
                                                            t.nombre AS rol,
                                                            if(l.log_estado = 1,"ACTIVO","BLOQUEADO") AS estado,
                                                            a.merchant,
                                                            (p.nombre) AS pais
                                                         FROM login_dash l
                                                            INNER JOIN tipo_user t ON t.descripcion = l.log_tipo
                                                            INNER JOIN pais p ON p.id = l.log_pais
                                                            LEFT JOIN aliado a ON a.uid = l.log_merchantid
                                                             WHERE l.log_estado = 1`, {
                                                                     model: Usuario,
                                                                     mapToModel: true // pass true here if you have any mapped fields
                                                             });

        return res.json({
            result: usuarios,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    }

}

const crearUsuario = async ( req, res = response ) => {

    try {

        const { log_merchantid, log_usuario, log_tipo, log_pais } = req.body;
        /*  const { log_tipo, id } = req.usuario;*/

        const usuarios = await Usuario.findAll({
            where: { 
                log_usuario: log_usuario
            }
        });

        if(usuarios.length == 0){

             //encriptar contraseña
            const salt = bcriptjs.genSaltSync();
            let pass = bcriptjs.hashSync( 'Toppaycol2022', salt );

            const data = {
                log_merchantid:log_merchantid,
                log_usuario: log_usuario,
                log_clave: pass,
                log_tipo: log_tipo,
                cashout: 0,
                log_pais: log_pais,
                log_estado: 1,
            }        
            
            const usuario2 = new Usuario(data);
            await usuario2.save();

            return res.json({
                result: usuario2,
                msg:"Usuario creado exitosamente",
                alerta:1,
                status: 1
            });

        }else{
            
            return res.json({
                result: usuarios.length ,
                msg:"Usuario ya se encuentra registrado",
                alerta:2,
                status: 1
            });
        }


    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }
}

const editarUsuario = async ( req, res = response ) => {

    try {

        const { log_merchantid, log_usuario, log_tipo, log_pais } = req.body;
        const { id } = req.params;

        const usuario = await Usuario.findByPk( id );

        if( !usuario ){
            return res.status(404).json({
                msg: 'No existe un usuario con el id '+id,
                alerta:2,
            })
        }

        await usuario.update({
            log_merchantid,
            log_usuario,
            log_tipo,
            log_pais
        });

        return res.json({
            result: usuario,
            msg:"Usuario modificado exitosamente",
            alerta:1,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }
}

const deleteUsuario = async ( req, res = response ) => {

    try {

        const { id } = req.params;

        const usuarios = await Usuario.findByPk( id );

        if( !usuarios ){
            return res.status(404).json({
                alerta:2,
                msg: 'No existe un usuario con el id '+id
            })
        }

        await usuarios.update({log_estado:2});

        return res.json({
            alerta:1,
            msg: 'Usuario eliminado',
            status: 1
        });


    } catch (error) {

        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    }
}

const passwordUsuario = async ( req, res = response ) => {

    try {

        const { id } = req.params;
       
        const usuario = await Usuario.findByPk( id );
        
        if( !usuario ){
            return res.status(404).json({
                msg: 'No existe un usuario con el id '+id,
                alerta:2,
            })
        }
        //encriptar contraseña
        const salt = bcriptjs.genSaltSync();
        let pass = bcriptjs.hashSync( 'Toppaycol2022', salt );

        await usuario.update({
            log_clave: pass,
        });


        return res.json({
            result: usuario,
            msg:"El cambio de la contraseña fue exitosa",
            alerta:1,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }
}

const verTipo = async (req, res = response) => {

    try {
        
        const tipo= await TipoUser.findAll();
    
        return res.json({
            result: tipo,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }

}

const cambiarEstado = async ( req, res = response ) => {

    try {
        
        const { pais : log_pais} = req.params;
        const { log_tipo, id } = req.usuario;

        const usuario = await Usuario.findByPk( id );

        if( !usuario ){
            return res.status(404).json({
                msg: 'No existe un usuario con el id '+id,
                alerta:2,
            })
        }

        await usuario.update({
            log_pais
        });

        return res.json({
            result: usuario,
            msg:"Cambio de pais exitoso",
            alerta:1,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }

}


module.exports = {
    verUsuario,
    deleteUsuario,
    crearUsuario,
    editarUsuario,
    passwordUsuario,
    verTipo,
    cambiarEstado
}