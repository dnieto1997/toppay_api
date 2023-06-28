const { response, json } = require('express');
const { Movimiento } = require('../models');
const { dbConnection } = require('../database/config');
const momentZone = require('moment-timezone'); 
const { paisesDashboard2 } = require('./paises');

const todayMoneyIn = async (req, res = response) => {

    try {
        
        const { log_tipo,log_merchantid, log_pais } = req.usuario;
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD');
       
        let consultClient = '';
        let consultPais = paisesDashboard2(log_pais);

        const fec = new Date();
        const fecYear = fec.getFullYear()
        const fecMonth = fec.getMonth() + 1 ;
        const fecDate = fec.getDate();
    
        if(log_tipo != 'TE'){
            consultClient = '';
        }else{
            consultClient = `AND merchant_id = "${log_merchantid}" `;
        }


        const movimiento = await dbConnection.query(`SELECT  sum(amount) AS total
                                                            FROM movimientos
                                                                WHERE DATE(updated_at) = "${fecha}"
                                                                ${consultClient}
                                                                ${consultPais}
                                                                AND type_transaction IN(1,3)
                                                                AND status='1' 
                                                                GROUP BY currency`, {
                                                                        model: Movimiento,
                                                                        mapToModel: true // pass true here if you have any mapped fields
                                                                    });
                                                                  
        const grafico = await dbConnection.query(`SELECT sum(if(type_transaction = 2,if(status = '2',1,0),0)) AS cashou,
                                                        sum(if(type_transaction = 1,if(status = '1',1,0),0)) AS cashin,
                                                            day(updated_at) AS mes  
                                                            FROM movimientos 
                                                            WHERE YEAR(updated_at) =  "${fecYear}"
                                                            AND MONTH(updated_at) = "${fecMonth}"
                                                            ${consultClient}
                                                            ${consultPais}
                                                            GROUP by day(updated_at)`, {
                                                                        model: Movimiento,
                                                                        mapToModel: true // pass true here if you have any mapped fields
                                                                    });
        
       
        return res.json({
            result: movimiento,
            grafico: grafico,
            status: 1
        });
       

    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const todaysTransactionIn = async (req, res = response) => {

    try {
        
        const { log_tipo, log_merchantid, log_pais } = req.usuario;
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD');

        let consultClient = '';
        let consultPais = paisesDashboard2(log_pais);

        const fec = new Date();
        const fecYear = fec.getFullYear()
        const fecMonth = fec.getMonth() + 1 ;
        const fecDate = fec.getDate();

        if(log_tipo != 'TE'){
            consultClient = '';
        }else{
            consultClient = `AND merchant_id = "${log_merchantid}" `;
        }

       
        const movimiento = await dbConnection.query(`SELECT count(uid) as total ,
                                                            (currency) AS moneda
                                                            FROM movimientos
                                                                WHERE DATE(updated_at) = "${fecha}"
                                                                ${consultClient}
                                                                ${consultPais}
                                                                AND type_transaction IN(1,3)
                                                                AND status='1' 
                                                                GROUP BY currency`, {
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

const todaysTransactionErrorIn = async (req, res = response) => {

    
    try {

        const { log_tipo, log_merchantid, log_pais } = req.usuario;
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD');

        let consultClient = '';
        let consultPais = paisesDashboard2(log_pais);

        const fec = new Date();
        const fecYear = fec.getFullYear()
        const fecMonth = fec.getMonth() + 1 ;
        const fecDate = fec.getDate();

        if(log_tipo != 'TE'){
            consultClient = '';
        }else{
            consultClient = `AND merchant_id = "${log_merchantid}" `;
        }

        const movimiento = await dbConnection.query(`SELECT count(uid) as total ,
                                                            (currency) AS moneda
                                                            FROM movimientos
                                                                WHERE DATE(updated_at) = "${fecha}"                                                      
                                                                ${consultClient}
                                                                ${consultPais}
                                                                AND type_transaction IN(1,3) 
                                                                AND status IN(2)
                                                                GROUP BY currency`, {
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

const todayMoneyOut = async (req, res = response) => {

    try {

        const { log_tipo,log_merchantid, log_pais } = req.usuario;
        const fecha = momentZone().tz("America/Bogota").format('Y-MM-DD');

        let consultClient = '';
        let consultPais = paisesDashboard2(log_pais);

        const fec = new Date();
        const fecYear = fec.getFullYear()
        const fecMonth = fec.getMonth() + 1 ;
        const fecDate = fec.getDate();

        if(log_tipo != 'TE'){
            consultClient = '';
        }else{
            consultClient = `AND merchant_id = "${log_merchantid}" `;
        }

        const movimiento = await dbConnection.query(`SELECT sum(amount) as total , 
                                                            (currency) AS moneda
                                                            FROM movimientos
                                                                WHERE DATE(updated_at) = "${fecha}"   
                                                                ${consultClient}
                                                                ${consultPais}
                                                                AND type_transaction='2'
                                                                AND status= 1 
                                                                GROUP BY currency`, {
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


const payInDashboard = async (req, res = response) => {

    try {

        const { log_tipo,log_merchantid, log_pais } = req.usuario;
        const fecha = momentZone().tz("America/Bogota").format('Y-MM-DD');

        let consultClient = '';
        let consultPais = paisesDashboard2(log_pais);

        const fec = new Date();
        const fecYear = fec.getFullYear()
        const fecMonth = fec.getMonth() + 1 ;
        const fecDate = fec.getDate();

        if(log_tipo != 'TE'){
            consultClient = '';
        }else{
            consultClient = `AND merchant_id = "${log_merchantid}" `;
        }

        const movimiento = await dbConnection.query(`SELECT sum(amount) as total , 
                                                            (currency) AS moneda
                                                            FROM movimientos
                                                                WHERE DATE(updated_at) = "${fecha}"   
                                                                ${consultClient}
                                                                ${consultPais}
                                                                AND type_transaction='2'
                                                                AND status= 1 
                                                                GROUP BY currency`, {
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


const todaysTransactionOut = async (req, res = response) => {

    try {
        
        const { log_tipo, log_merchantid, log_pais } = req.usuario;
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD');

        let consultClient = '';
        let consultPais = paisesDashboard2(log_pais);
        
        const fec = new Date();
        const fecYear = fec.getFullYear()
        const fecMonth = fec.getMonth() + 1 ;
        const fecDate = fec.getDate();

        if(log_tipo != 'TE'){
            consultClient = '';
           
        }else{
            consultClient = `AND merchant_id = "${log_merchantid}" `;
        }
    
        const movimiento = await dbConnection.query(`SELECT count(uid) as total,
                                                            (currency) AS moneda
                                                            FROM movimientos
                                                                WHERE DATE(updated_at) = "${fecha}"   
                                                                ${consultClient}
                                                                ${consultPais}
                                                                AND type_transaction='2'
                                                                AND status= 1 
                                                                GROUP BY currency`, {
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

const payOutDashboard = async (req, res = response) => {

    try {
        
       const { fecha1, fecha2, estado,aliado } = req.body;
        const { log_pais } = req.usuario;

        let sqlSuccess = '';
        let sqlAliado = '';
        let consultPais = paisesPayout(log_pais);

        if(estado == 0){
            sqlSuccess = `AND m.status IN(1,3)`;
        }else  if(estado == 1){
            sqlSuccess = `AND m.status IN(1)`;
        }else  if(estado == 3){
            sqlSuccess = `AND m.status IN(3)`;
        }

        if(aliado == 0){
            sqlAliado = '';
        }else{
            sqlAliado = `AND m.merchant_id = "${aliado}"`;
        } 

        const movimientos = await dbConnection.query(` SELECT 
        merchant_name, 
        type_transaction,
        COUNT(merchant_name) AS cantidad 
      FROM 
        movimientos 
      WHERE 
         DATE(m.updated_at) BETWEEN "${fecha1}" AND "${fecha2}"
        AND m.method = 'TUP_OUT'
        ${sqlSuccess}
        ${sqlAliado}
        ${consultPais}
      GROUP BY 
        merchant_name, 
        type_transaction;
       
        `
        
        
        );
        return res.json({
            result: movimientos,
            status: 1
        });
       

    } catch (err) {
        
       return('hola')
    }
}





module.exports = {
    todayMoneyIn,
    todaysTransactionIn,
    todaysTransactionErrorIn,
    todayMoneyOut,
    todaysTransactionOut,
    payInDashboard,
    payOutDashboard
}