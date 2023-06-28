const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Movimiento,Davivienda } = require('../models');
const moment = require('moment'); 

const conciliacionMethod = async (req, res = response) => {

    try {
      
        const movimiento = await dbConnection.query(`
            SELECT method FROM movimientos WHERE 1 GROUP BY method;
        `, {
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

const conciliacionMovimiento = async (req, res = response ) => {

    try {

        const { fecha, metodo, excel } = req.body;
        const fechaSys = moment().format('Y-M-D');

        const consultaDavivienda = await Davivienda.findAll({
            where: { fecha: fecha },
        });

        if(consultaDavivienda.length == 0){

            if(excel){
                let newArr = [];
    
                for await (let element of excel){
                    
                    newArr.push({
                                    "banco":element.banco,
                                    "destino":element.destino,
                                    "tipo":element.tipo,
                                    "titular":element.titular,
                                    "valor":element.valor,
                                    "fecha":fecha,
                                    "idmovimiento":0
                                });
    
                }
    
                const resp = await Davivienda.bulkCreate(newArr);
            }
        }

       const movimiento = await dbConnection.query(`
            SELECT SUM(amount) AS total FROM movimientos WHERE date(updated_at) = '${fecha}' AND status=1 AND user_bank IN("DAVIPLATA","BANCO DAVIVIENDA");
        `, {
                    model: Movimiento,
                    mapToModel: true // pass true here if you have any mapped fields
        });

         

        const davivienda = await Davivienda.findAll({
            where: { fecha: fecha,idmovimiento:0  },
        })

        return res.json({
            tabla: davivienda,
            total: movimiento[0],
            excel:excel,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    }
}

const conciliacionBuscar = async (req, res = response ) => {

    try {

        const { destino, valor, fecha } = req.body;

        const year = moment(fecha).format('Y');
        const month = moment(fecha).format('M');

        const movimiento = await dbConnection.query(`
        SELECT  *,
                DATE(updated_at) AS fecha
                FROM movimientos 
                    WHERE amount = ${valor} 
                    AND user_bank IN("DAVIPLATA","BANCO DAVIVIENDA")
                    AND RIGHT(user_num_account,4) = "${destino}"
                    AND YEAR(updated_at) = "${year}"
                    AND MONTH(updated_at) <= "${month}"
                    AND !EXISTS (SELECT idmovimiento FROM banco_davivienda WHERE idmovimiento = uid);
        `, {
                    model: Movimiento,
                    mapToModel: true // pass true here if you have any mapped fields
        });
        return res.json({
            rep: movimiento,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    }
}

const conciliacionEditar = async (req, res = response ) => {

    try {

        const { idB, idM } = req.body;

        const davivienda = await Davivienda.findByPk( idB );

        await davivienda.update({idmovimiento:idM});

        return res.json({
            rep: davivienda,
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
    conciliacionMethod,
    conciliacionMovimiento,
    conciliacionBuscar,
    conciliacionEditar
}