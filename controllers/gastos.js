const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Gastos } = require('../models');
const moment = require('moment'); 

const verGastos = async (req, res = response) => {


    try {
        
        const { startDate , endDate } = req.params;

        /* const gastos = await Gastos.findAll({
            where: { 
                fecha: {
                    $between: [startDate, endDate]
                }
             },
        }); */

        const gastos = await dbConnection.query(`SELECT g.*,
                                                        l.log_usuario
                                                        FROM gastos g
                                                            INNER JOIN login_dash l ON l.log_id = g.usuario 
                                                            WHERE g.estado = 1 AND g.fecha BETWEEN "${startDate}" AND "${endDate}";`,
                                                             {
                                                                model: Gastos,
                                                            });

        return res.json({
            result: gastos,
            status: 1
        });


    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const crearGastos = async (req, res = response) => {

    try {
        
        const { fecha, detalle, valor } = req.body;
        const { log_tipo, id } = req.usuario;

        const fechasis = moment().format('Y-M-D hh:mm:ss');

        const data = {
            fecha:fecha,
            detalle: detalle,
            valor: valor,
            fechasis: fechasis,
            usuario: id,
            estado: 1,
        }        
        
        const gastos = new Gastos(data);
        await gastos.save();

        return res.json({
            result: gastos,
            status: 1
        });

    } catch (error) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const editarGastos = async (req, res = response) => {

    try {
        
        const { ...body } = req.body;
        const { id } = req.params;
        const { id : idUsuario } = req.usuario;

        const fechasis = moment().format('Y-M-D hh:mm:ss');

        const gastos = await Gastos.findByPk( id );

        if( !gastos ){
            return res.status(404).json({
                msg: 'No existe un gasto con el id '+id
            })
        }

        body.usuario = idUsuario;
        body.fechasis = fechasis;

        await gastos.update(body);

        return res.json({
            result: gastos,
            status: 1
        });

    } catch (error) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }

}

const eliminarGastos = async (req, res = response) => {

    try {
        
        const { id } = req.params;

        const gastos = await Gastos.findByPk( id );

        const { id : idUsuario } = req.usuario;

        const fechasis = moment().format('Y-M-D hh:mm:ss');

        if( !gastos ){
            return res.status(404).json({
                msg: 'No existe un gasto con el id '+id
            })
        }

        await gastos.update({estado:2, fechasis: fechasis, usuario: idUsuario});

        return res.json({
            result: gastos,
            status: 1
        });

    } catch (error) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }

}


module.exports = {
    verGastos,
    crearGastos,
    editarGastos,
    eliminarGastos
}