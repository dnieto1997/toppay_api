const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Movimiento, MovEstado, Aliado, Masiva, Comparar } = require('../models');
const moment = require('moment');
const momentZone = require('moment-timezone');
const LogsCallbacks = require('../models/callbackslogs');

const tablePayoutPeru = async (req, res = response) => {


    try {

        const { status = 0, fech1, fech2 } = req.body;
        const { log_tipo, log_merchantid } = req.usuario;

        const fecha = momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        let sqlStatus = '';
        let consultClient = '';

        if (status == 0) {
            sqlStatus = '';
        } else {
            sqlStatus = ` AND status = '${status}'`;
        }

        if (log_tipo == 'TE') {
            consultClient = ` AND merchant_id = "${log_merchantid}" `;
        }


        const movimiento = await dbConnection.query(`SELECT uid,
                                                            user_name,
                                                            user_email,
                                                            reference,
                                                            user_doc,
                                                            user_phone,
                                                            method,
                                                            DATE(created_at) AS fecha,
                                                            TIME(created_at) AS hora,
                                                            amount,
                                                            user_bank,
                                                            user_type_account,
                                                            user_num_account,
                                                            merchant_name,
                                                            status,
                                                            cost,
                                                            iva,
                                                            IF(status=1,"SUCCESS",IF(status=2,"PENDING",IF(status=3,"DECLINED","NONE"))) AS estado,
                                                            CONCAT("https://productionperu.toppaylatam.com/public/asset/consignaciones/",uid,".jpg?nocache=${fecha}") As url
                                                            FROM movimientos
                                                                WHERE currency = 'SOL'
                                                                AND DATE(created_at) BETWEEN "${fech1}" AND "${fech2}"
                                                                ${sqlStatus}
                                                                ${consultClient}
                                                                AND type_transaction = '1'
                                                                ORDER BY uid desc`, {
            model: Movimiento,
        });

        return res.json({
            result: movimiento,
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

const pagarPayoutPeru = async (req, res = response) => {

    try {

        const { id } = req.params;
        const { id: user } = req.usuario;
        const { valor, reference } = req.body;

        console.log("usuaRIOS", req.usuario)
        console.log("ggg", req.params)

        const fecha = momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        const buscarref = await Movimiento.findAll({
            where: { reference_pro2: reference },
        });

        if (buscarref.length != 0) {
            return res.json({
                result: `Esta referencia se encuentra registrada`,
                status: 1,
            });
        }

        //Buscar movimientos
        const movimientoB = await Movimiento.findAll({
            where: { uid: id },
        });

        const logs_callbacks = await LogsCallbacks.findAll({
            where: { referenceid: id },
        });
        console.log("encontro algo", logs_callbacks)
        //Buscar merchant id


        const aliados = await Aliado.findAll({
            where: { uid: movimientoB[0].merchant_id },
        })

        const movimiento = await dbConnection.query(`UPDATE movimientos 
                                                        SET status='1',
                                                        cost=${valor}*(${aliados[0].pse_porcentaje}/100), 
                                                        iva= (${valor}*(${aliados[0].pse_porcentaje}/100)) *0.18, 
                                                        notify='E',
                                                        amount = ${valor},
                                                        reference_pro2 = "${reference}",
                                                        updated_at = "${fecha}"
                                                            WHERE uid = '${id}'`);
        const data = {
            user: user,
            movimiento: id,
            date: fecha,
            tipo: "payout",
            estado: '1'
        }


        if (logs_callbacks.length > 0) {
            const raw = JSON.stringify({
                "reference": movimientoB[0].reference,
                "status": "success",
                "amount": valor,
                "referenceid": id,
                "method": `${movimientoB[0].method}`
            });



            const movimiento2 = await dbConnection.query(`UPDATE logs_callbacks
    SET amount = ${valor},
        user_created = ${user},
        date_notify = "${fecha}",
        status = '1',
        url_callback = '${aliados[0].url_response}',
        json = '${raw}'
    
    WHERE referenceid = ${id}`);

        }








        const movestado = new MovEstado(data);
        await movestado.save();


        //Curls
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "reference": movimientoB[0].reference,
            "status": "success",
            "amount": valor,
            "referenceid": id,
            "method": `${movimientoB[0].method}`
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(aliados[0].url_response, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));



        if (movimiento[0].changedRows == 0) {
            return res.json({
                result: `Error al pagar id: ${id} esta Pagado`,
                status: 1,
            });
        } else {

            return res.json({
                result: `el id: ${id} fue pagado exitosamente `,
                status: 1
            });

        }

    } catch (err) {

        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const rechazarPayoutPeru = async (req, res = response) => {

    try {

        const { id: user } = req.usuario;
        const fecha = momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        const { id } = req.params;
        const { motivo } = req.body;

        //Buscar movimientos
        const movimientoB = await Movimiento.findAll({
            where: { uid: id },
        });

        //Buscar merchant id
        const aliados = await Aliado.findAll({
            where: { uid: movimientoB[0].merchant_id },
        })
        const logs_callbacks = await LogsCallbacks.findAll({
            where: { referenceid: id },
        });

        const movimiento = await dbConnection.query(`UPDATE movimientos 
                                                        SET status ='3',
                                                        cost=${movimientoB[0].amount}*(${aliados[0].pse_porcentaje}/100), 
                                                        iva= (${movimientoB[0].amount}*(${aliados[0].pse_porcentaje}/100)) *0.18, 
                                                        notify ='E' 
                                                        WHERE uid ='${id}'`);


        if (logs_callbacks.length > 0) {
            const raw = JSON.stringify({
                "reference": movimientoB[0].reference,
                "status": "declined",
                "amount": movimientoB[0].amount,
                "referenceid": movimientoB[0].id,
                "method": `${movimientoB[0].method}`,
                "errorMsg": motivo
            });

            const movimiento2 = await dbConnection.query(`UPDATE logs_callbacks
                                                            SET amount = ${movimientoB[0].amount},
                                                                user_created = ${user},
                                                                date_notify = "${fecha}",
                                                                status = '3',
                                                                url_callback = '${aliados[0].url_response}',
                                                                json = '${raw}',
                                                                motivo='${motivo}'
                                                            WHERE referenceid = ${id}`);

        }



        const data = {
            user: user,
            movimiento: id,
            date: fecha,
            tipo: "payin",
            estado: '3'
        }

        const movestado = new MovEstado(data);

        await movestado.save();

        //Curls
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "reference": movimientoB[0].reference,
            "status": "declined",
            "amount": movimientoB[0].amount,
            "referenceid": movimientoB[0].id,
            "method": `${movimientoB[0].method}`,
            "errorMsg": motivo
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(aliados[0].url_response, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));


        if (movimiento[0].changedRows == 0) {
            return res.json({
                result: `Error al rechazar id: ${id}`,
                status: 1,
            });
        } else {

            return res.json({
                result: `el id: ${id} fue rechazar exitosamente `,
                status: 1
            });
        }

    } catch (err) {

        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }

}


module.exports = {
    tablePayoutPeru,
    pagarPayoutPeru,
    rechazarPayoutPeru
}
