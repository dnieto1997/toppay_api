const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Disperciones, Bancos } = require('../models');
const moment = require('moment'); 
const momentZone = require('moment-timezone'); 
const { paisesBalance } = require('./paises');

const crearDispersiones = async ( req, res = response ) => {

    try {

        const { merchant, banco, cuenta, valor, tipo, gmf } = req.body;
         const { log_pais } = req.usuario;
       // const fechasis = moment().format('Y-M-D hh:mm:ss');
        const fechasis =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        const data = {
            merchant:merchant,
            fechainicio:fechasis,
            fechafin:fechasis,
            fechapago:fechasis,
            banco: banco,
            cuenta: cuenta,
            valor: valor,
            tipo: tipo,
            gmf: gmf,
            pais: log_pais,
            estado: 1,
        }        
            
            const disperciones = new Disperciones(data);
            await disperciones.save();

            return res.json({
                result: disperciones,
                msg:"Dispercion creada exitosamente",
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

const eliminarDispersiones = async ( req, res = response ) => {

    try {
        const { id } = req.params;

        const disperciones = await Disperciones.findByPk( id );

        if( !disperciones ){
            return res.status(404).json({
                alerta:2,
                msg: 'No existe un Dispersion con el id '+id
            })
        }

        await disperciones.update({estado:2});

        return res.json({
            alerta:1,
            msg: 'Dispersion eliminada',
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }
}

const verDispersiones = async ( req, res = response ) => {

    try {
        
  /*   const disperciones = await Disperciones.findAll({
        where:{
            estado:1
        }
    }); */
    const {  log_pais } = req.usuario;

    let consultPais = paisesBalance(log_pais);

    const disperciones = await dbConnection.query(` SELECT d.*,
                                                            a.merchant AS nomaliado,
                                                            if(d.banco REGEXP '^[0-9]'= 0,d.banco,b.nombre) AS bancoaliado,
                                                            if(d.tipo="S","SALIDA","ENTRADA") AS tipoaliado,
                                                            (p.nombre) AS paisn
                                                        FROM dispersiones d
                                                            LEFT JOIN aliado a ON a.uid = d.merchant
                                                            LEFT JOIN bancos b ON b.id = d.banco
                                                            INNER JOIN pais p ON p.id = d.pais
                                                            ${consultPais}
                                                            WHERE d.estado = 1`, {
        model: Disperciones,
        mapToModel: true // pass true here if you have any mapped fields
    });

    return res.json({
        result: disperciones,
        msg:"Listado exitosamente",
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

const verBancos = async ( req, res = response ) => {

    try {

        const { aliado } = req.body;
            
        const bancos = await Bancos.findAll({
            where: { 
                merchant: aliado
            }
        });

        return res.json({
            result: bancos,
            msg:"lista exitosa",
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

const gmfDispersiones = async ( req, res = response ) => {

    try {
        
        const { idgmf, valorgmf } = req.body;

        const disperciones = await Disperciones.update({
            gmf: valorgmf,
        },
        {
            where: {  id: idgmf }
        });

        return res.json({
            result: disperciones,
            msg:"Cambio de Gmf exitosa",
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
    crearDispersiones,
    verBancos,
    verDispersiones,
    eliminarDispersiones,
    gmfDispersiones
}