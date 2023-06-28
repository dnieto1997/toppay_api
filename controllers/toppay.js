const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Toppay, Movimiento, NequiTopup, Aliado } = require('../models');

const moment = require('moment'); 
const momentZone = require('moment-timezone'); 

const verToppay = async (req, res = response) => {

    try {
        const toppay = await Toppay.findOne({
            where: {
                id: 1
            }
        });
        return res.json({
            result: toppay,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    }

}

const tablaToppay = async (req, res = response) => {

    try {

        const { fecha1,fecha2 } = req.body;

        const toppay = await Toppay.findOne({
            where: {
                id: 1
            }
        });

        let aliado = JSON.parse(toppay.aliados);

     /*    AND DATE(s.created_at) BETWEEN "${fecha1}" AND "${fecha2}" */

        /* const verTabla = await Movimiento.findAll({
            limit: 100,
            where: {
                merchant_id: aliado,
                status: 2,
                method: "TUP_OUT",
                currency: "COP",
                user_bank: "NEQUI",
                type_transaction: 2,
                Date(created_at): [fecha1, fecha2]
            },
            order: [['uid', 'ASC']]
        }); */

        const verTabla = await dbConnection.query(`
            SELECT * FROM movimientos
                WHERE   
                merchant_id in(${aliado}) AND
                status= 2 AND
                method= "TUP_OUT" AND
                currency= "COP" AND
                user_bank= "NEQUI" AND
                type_transaction= 2 AND
                DATE(created_at) BETWEEN "${fecha1}" AND "${fecha2}" 
                ORDER BY uid DESC
        `, {
            model: Movimiento,
        });

        return res.json({
            result: verTabla,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }

}

const saveToppay = async (req, res = response) => {

    const { monto, aliados } = req.body;
   
    try {
        let id = 1;
        const toppay = await Toppay.findByPk( id );

        await toppay.update({
            aliados,
            monto
        });

        return res.json({
            result: toppay,
            status: 1
        });

    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}


const recargaToppay = async (req, res = response) => {

    const { info } = req.body;
    const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

    try {
        
        const resp = await apiNequi(info.reference,Number(info.amount),info.user_doc,info.user_num_account,info.user_email,info.user_name);

        const arrResp = JSON.parse(resp);

        const resp2 = '';


        if(arrResp.code != '01'){

            /* GUARDAR RESPUESTA EN LA TABLA nequi_topup  */
            const saveNequi_Topup = {
                respuesta:resp,
                fecha: fecha,
                referencia: info.reference,
                respaliado: resp2,
            }      

            const nequiTop = new NequiTopup(saveNequi_Topup);
            await nequiTop.save();

            return res.status(400).json({
                result: [],
                msg:arrResp.message,
                status: 1
            });
        }

        /* ACTUALIZAR EL MOVIMIENTO  */
        const buscarMov = await Movimiento.findByPk( info.uid );

        await buscarMov.update({
            status:1,
            cost:0,
            iva:0,
            notify:'E',
            updated_at:fecha
        });

        const buscarurl = await Aliado.findByPk( buscarMov.merchant_id );
        
       // resp2 = await apiAliado(info.reference,'',1,'COP',Number(info.amount),'TUP_OUT',buscarurl.url_response);

        /* GUARDAR RESPUESTA EN LA TABLA nequi_topup  */
        const saveNequi_Topup = {
            respuesta:resp,
            fecha: fecha,
            referencia: info.reference,
            respaliado: resp2,
        }      

        const nequiTop = new NequiTopup(saveNequi_Topup);
        await nequiTop.save();

        return res.json({
            result: [info.reference,'',1,'COP',Number(info.amount),'TUP_OUT',buscarurl.url_response],
            msg:arrResp.message,
            status: 1
        });
        
      
    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }
};

const apiNequi = (referencia,amount,cedula,nequi,correo,nombre ) => {
    return new Promise( (resolve, reject) => {
        
        const user = 'TOPPAY_33344249563';
        const pass = '3V3C3a$RsqgmLb50rbqLr0dLv1';
    
        const apiUrl ="https://transactions.topup.com.co/production/api/v1/payout";
        
        let myHeaders = new Headers();
        myHeaders.append("Token-Top", "ef8b0461f5738e3084679bd6897d66d43c89e85e2aa060d029fa73f8576a3337");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic VE9QUEFZXzMzMzQ0MjQ5NTYzOjNWM0MzYSRSc3FnbUxiNTByYnFMcjBkTHYx") ;

        let raw = JSON.stringify({
            "response_sandbox": "APPROVED",
            "register": true,
            "payment_method": "NEQUI",
            "reference": `${referencia}`,
            "amount": amount,
            "currency": "COP",
            "customer_data": {
              "legal_doc": `${cedula}`,
              "legal_doc_type": "CC",
              "phone_code": "57",
              "phone_number": `${nequi}`,
              "email": `${correo}`,
              "full_name": `${nombre}`
            }
        });

       /*  let raw = JSON.stringify({
            "response_sandbox": "APPROVED",
            "register": true,
            "payment_method": "NEQUI",
            "reference": `prueba000000209`,
            "amount": 1000,
            "currency": "COP",
            "customer_data": {
              "legal_doc": `${cedula}`,
              "legal_doc_type": "CC",
              "phone_code": "57",
              "phone_number": `3005102545`,
              "email": `${correo}`,
              "full_name": `${nombre}`
            }
        }); */

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

         fetch(apiUrl, requestOptions)
        .then(response => response.text())
        .then((result) =>{
            resolve( result );
        })
        .catch(error => {
            reject( error );
        });
        
    });
}

const apiAliado = (referencia,ErrSms,status,currency,amount,method,url ) => {
    return new Promise( (resolve, reject) => {
        
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
    
            let raw = JSON.stringify({
                "reference": `${referencia}`,
                "ErrSms": `${ErrSms}`,
                "status": `${status}`,
                "currency": `${currency}`,
                "amount": `${amount}`,
                "method": `${method}`
            });
    
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
    
             fetch(url, requestOptions)
            .then(response => response.text())
            .then((result) =>{
                resolve( result );
            })
            .catch(error => {
                reject( error );
            });
            
    });
}
const pruebacallback = (valor1,valor2, valor3, valor4) =>{
    return new Promise( (resolve, reject) => {
        
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "valor1": `${valor1}`,
            "valor2": `${valor2}`,
            "valor3": `${valor3}`,
            "valor4": `${valor4}`
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

         fetch(url, requestOptions)
        .then(response => response.text())
        .then((result) =>{
            resolve( result );
        })
        .catch(error => {
            reject( error );
        });
        
});
}
module.exports = {
    saveToppay,
    verToppay,
    tablaToppay,
    recargaToppay,
    pruebacallback
}