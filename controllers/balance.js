const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Movimiento, Disperciones } = require('../models');
const moment = require('moment'); 
const { paisesBalance, paisesDashboard2 } = require('./paises');

const verbalance = async (req, res = response) => {

    try {

        const { log_pais , log_tipo, log_merchantid } = req.usuario;

        let consultClient = '';
        let consultDispercion = '';
        let consultPais2 = paisesDashboard2(log_pais);
        let consultPais1 = paisesBalance(log_pais);

        if(log_tipo != 'TE'){
            consultClient = '';
        }else{
            consultClient =  `AND merchant_id = ${log_merchantid}`;
            consultDispercion = `AND d.merchant = ${log_merchantid}`
        }

        const totalBalance = await dbConnection.query(`SELECT   COUNT(uid) AS und,
                                                                SUM( IF( type_transaction = 2,(amount + ( cost + iva )),0  ) ) AS payout,
                                                                ( 
                                                                    SUM( 
                                                                            IF( type_transaction = 1,(amount - ( cost + iva )),0  ) ) 
                                                                            + 
                                                                    SUM( IF( type_transaction = 3,(amount - ( cost + iva )),0  ) ) 
                                                                ) AS payin
                                                                FROM movimientos
                                                                where status = "1"
                                                                ${consultClient}
                                                                ${consultPais2}
                                                                `, {
                                                                    model: Movimiento,
                                                                    mapToModel: true // pass true here if you have any mapped fields
                                                                });

        const dispersio = await dbConnection.query(`SELECT  d.id,
                                                            d.fechapago,
                                                            d.banco,
                                                            d.cuenta,
                                                            d.valor,
                                                            d.tipo,
                                                            d.gmf,
                                                            d.estado,
                                                            d.merchant,
                                                            a.merchant AS aliado,
                                                            if(d.estado = 1, "Success",
                                                                if(d.estado = 2, "Waiting",
                                                                    if(d.estado = 3, "Declined","Error")
                                                                )
                                                            ) AS estadon,
                                                            if(d.tipo = "S" ,"Salida",
                                                                if(d.tipo = "E", "Entrada","Error" )
                                                            ) AS tipon,
                                                            if(d.banco REGEXP '^[0-9]'= 0,d.banco,b.nombre) AS bancoaliado
                                                                FROM dispersiones d
                                                                    LEFT JOIN bancos b ON b.id = d.banco
                                                                    LEFT JOIN aliado a ON a.uid  = d.merchant
                                                                    WHERE  d.estado = 1 
                                                                    ${consultDispercion}
                                                                    ${consultPais1}
                                                                    ORDER BY d.id DESC
                                                            `, {
                                                                model: Disperciones,
                                                                mapToModel: true // pass true here if you have any mapped fields
                                                            })

        return res.json({
            result: totalBalance[0],
            result2: dispersio,
            log_tipo: log_tipo,
            status: 1
        });
       
       

    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const buscarbalance = async (req, res = response) => {

    try {

        const { aliado = "", fecha1 = "", fecha2 = ""} = req.body;

        const { id , log_pais, log_tipo, log_merchantid } = req.usuario;

        let consultClient = '';
        let consultfecha = '';
        let consultfecha2 = '';
        let consultDispercion = '1';
        let consultPais1 = paisesBalance(log_pais);
        let consultPais2 = paisesDashboard2(log_pais);

        if(aliado != ''){
            consultDispercion = ` d.merchant = ${aliado}`;
            consultClient =  ` AND merchant_id = ${aliado} `;
        }else{
            consultDispercion = '1';
            consultClient = ''
        }

        consultfecha  = `AND (updated_at) BETWEEN "${fecha1}" AND "${fecha2}"`;
        consultfecha3  = `AND date(updated_at) BETWEEN "${ moment(fecha1).format('Y-MM-DD') }" AND "${ moment(fecha2).format('Y-MM-DD') }"`;
        consultfecha2 = `AND (d.fechapago) BETWEEN "${ moment(fecha1).format('Y-MM-DD') }" AND "${ moment(fecha2).format('Y-MM-DD') }"`;

        const totalBalance = await dbConnection.query(`SELECT   COUNT(uid) AS und,
                                                                SUM( IF( type_transaction = '2',(amount + ( cost + iva )),0  ) ) AS payout,
                                                                ( 
                                                                    SUM( 
                                                                        IF( type_transaction = 1,(amount - ( cost + iva )),0  ) 
                                                                    ) + 
                                                                    SUM( 
                                                                        IF( type_transaction = 3,(amount - ( cost + iva )),0  ) 
                                                                    ) 
                                                                ) AS payin
                                                                FROM movimientos
                                                                where status = "1"
                                                                ${consultfecha}
                                                                ${consultClient}
                                                                ${consultPais2}
                                                                `, {
                                                                    model: Movimiento,
                                                                    mapToModel: true // pass true here if you have any mapped fields
                                                                });

        const dispersio = await dbConnection.query(`SELECT  d.id,
                                                            d.fechapago,
                                                            d.banco,
                                                            d.cuenta,
                                                            d.valor,
                                                            d.tipo,
                                                            d.gmf,
                                                            d.estado,
                                                            d.merchant,
                                                            a.merchant AS aliado,
                                                            if(d.estado = 1, "Success",
                                                                if(d.estado = 2, "Waiting",
                                                                    if(d.estado = 3, "Declined","Error")
                                                                )
                                                            ) AS estadon,
                                                            if(d.tipo = "S" ,"Salida",
                                                                if(d.tipo = "E", "Entrada","Error" )
                                                            ) AS tipon,
                                                            if(d.banco REGEXP '^[0-9]'= 0,d.banco,b.nombre) AS bancoaliado
                                                                FROM dispersiones d
                                                                    LEFT JOIN bancos b ON b.id = d.banco
                                                                    LEFT JOIN aliado a ON a.uid  = d.merchant
                                                                    WHERE ${consultDispercion}
                                                                    ${consultfecha2}
                                                                    ${consultPais1}
                                                                    ORDER BY d.id DESC
                                                            `, {
                                                                model: Disperciones,
                                                                mapToModel: true // pass true here if you have any mapped fields
                                                            })

        return res.json({
            result: totalBalance[0],
            result2: dispersio,
            log_tipo: log_tipo,
            fe:consultfecha,
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
    verbalance,
    buscarbalance
}