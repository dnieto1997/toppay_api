const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Movimiento, MovEstado, Aliado } = require('../models');
const moment = require('moment'); 
const { paisesDashboard2 } = require('./paises');

const tableCashin = async (req, res = response) => {

    const { fecha1, fecha2, user = 0, reference = 0, aliado = undefined, status = 1} = req.query;
    const { id , log_tipo, log_merchantid, log_pais } = req.usuario;
    
    try {

        
        let consultReference = '';
        let consultAliado = '';
        let consultClient = '';
        let consultPais = paisesDashboard2(log_pais);
        
        if( reference != 0 ){
            consultReference = `AND reference = "${reference}" `;
        }
        if(log_tipo != 'TE'){
            consultClient = '';
        }else{
            consultClient = `AND merchant_id = "${log_merchantid}" `;
        }

        if( aliado != 0 ){
            consultAliado = `AND merchant_id = "${aliado}" `;
        }
        
        
        const movimiento = await dbConnection.query(`SELECT uid,
                                                            user_name,
                                                            user_email,
                                                            reference,
                                                            reference_pro AS referencepro,
                                                            reference_pro2 AS referencepro2,
                                                            user_doc,
                                                            user_phone,
                                                            method,
                                                            currency,
                                                            created_at,
                                                            updated_at,
                                                            DATE(updated_at) AS fecha,
                                                            TIME(updated_at) AS hora,
                                                            amount,
                                                            user_bank,
                                                            user_type_account,
                                                            user_num_account,
                                                            merchant_name,
                                                            cost,
                                                            iva,
                                                            (cost+iva) AS total,
                                                            status
                                                            FROM movimientos
                                                                WHERE type_transaction IN('1','3')
                                                                AND status= ${status}
                                                                AND DATE(updated_at) BETWEEN "${fecha1}" AND "${fecha2}"
                                                                ${consultReference}
                                                                ${consultClient}
                                                                ${consultAliado}
                                                                ${consultPais}
                                                                ORDER BY uid desc`, {
                                                                        model: Movimiento,
                                                                        mapToModel: true // pass true here if you have any mapped fields
                                                                    });

        return res.json({
            result: movimiento,
            status: 1
        });
       
       

    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const cambiarEstadoMovimiento = async ( req, res = response ) => {

    const { reference, estado } = req.params;

    //buscar Movimiento
    const movimiento = await Movimiento.findAll({
        where: { reference: reference },
    });


    if( movimiento.length == 0 ){

        return res.json({
            msg: "La referencia no existe",
            resp: movimiento,
            alert:1
        });

    }else{

        const updateEstado = await Movimiento.update({
            status: estado,
            updated_at: movimiento[0].created_at
        },
        {
            where: { reference: reference }
        });

        const aliados = await Aliado.findAll({
            where: { uid: movimiento[0].merchant_id },
        });

        let status = '';
        
        if(estado == 1){
            status = 'success';
        }else if(estado == 3){
            status = 'declined';
        }

        let respuestas = '';
       
        if(estado == 1 || estado == 3){

            //Curls
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
        
            const raw = JSON.stringify({
                "reference": reference,
                "status": status,
                "method": `${movimiento[0].method}`
            });
        
            const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
        
            respuestas = await fetch(aliados[0].url_response , requestOptions)
                .then(response => response.text())
                .then((result) =>{
                        
                    return result;
                })
                .catch(error => {
                    return error
                });

        }

        return res.json({
            resp: aliados,
            resp2: respuestas,
            msg: "Cambio exitoso",
            alert:2
        });

    }

   
}

const cambiarEstadoMovimiento2 = async ( req, res = response ) => {

    const { reference, estado } = req.params;

    //buscar Movimiento
    const movimiento = await Movimiento.findAll({
        where: { id: reference },
    });


    if( movimiento.length == 0 ){

        return res.json({
            msg: "El ID no existe",
            resp: movimiento,
            alert:1
        });

    }else{

        const updateEstado = await Movimiento.update({
            status: estado,
            updated_at: movimiento[0].created_at
        },
        {
            where: { id: reference }
        });

        const aliados = await Aliado.findAll({
            where: { uid: movimiento[0].merchant_id },
        });

        let status = '';
        
        if(estado == 1){
            status = 'success';
        }else if(estado == 3){
            status = 'declined';
        
        }
        let respuestas = '';
        
        if(estado == 1 || estado == 3){

             //Curls
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            const raw = JSON.stringify({
                "reference": movimiento[0].reference,
                "status": status,
                "method": `${movimiento[0].method}`
            });
            
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            
            respuestas = await fetch(aliados[0].url_response , requestOptions)
            .then(response => response.text())
            .then((result) =>{
                    
                return result;
            })
            .catch(error => {
                return error
            });
        }

        return res.json({
            resp: aliados,
            resp2: respuestas,
            msg: "Cambio exitoso",
            alert:2
        });

    }

   
}

module.exports = {
    tableCashin,
    cambiarEstadoMovimiento,
    cambiarEstadoMovimiento2
}