const { response } = require('express');
const { dbConnection } = require('../database/config');
const { Movimiento } = require('../models');
const { paisesDashboard2 } = require('./paises');

const tableUtilidades = async (req, res = response) => {


    try {
        
        const { fecha1, fecha2 } = req.body;
        const { log_pais } = req.usuario;
        
        let consultPais = paisesDashboard2(log_pais);
    
        const movimiento = await dbConnection.query(`SELECT MONTH(updated_at) AS fecha,
                                                            merchant_name AS cliente,
                                                            COUNT(uid) AS transacciones,
                                                            SUM(amount) AS sumatoria,
                                                            SUM(cost) AS utilidad,
                                                            SUM(cost) AS total,
                                                            ( 
                                                                SUM( IF(type_transaction = 1,amount-(cost+iva),0) ) 
                                                                + SUM( IF(type_transaction = 3,amount-(cost+iva),0) ) 
                                                            ) AS payin,
                                                            ( 
                                                                SUM( IF(type_transaction = 1,1,0) ) 
                                                                + SUM( IF(type_transaction = 3,1,0) ) 
                                                            ) AS payincount,
                                                            SUM( IF(type_transaction = 2,amount+(cost+iva),0) ) AS payout,
                                                            SUM( IF(type_transaction = 2,1,0) ) AS payoutcount,
                                                            merchant_id
                                                            FROM movimientos 
                                                            WHERE 
                                                            merchant_id != 3
                                                            AND status = "1"
                                                            AND DATE(updated_at)  BETWEEN "${fecha1}" AND "${fecha2}" 
                                                            ${consultPais}
                                                            GROUP BY merchant_id,merchant_name, MONTH(updated_at)
                                                            `,{
            model: Movimiento,
        });
    
    
        return res.json({
            result: movimiento
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${error}`,
            status: 1
        });
    }
   

}

module.exports = {
    tableUtilidades
}