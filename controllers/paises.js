const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Pais } = require('../models');

const verPais = async ( req, res = response ) => {

    try {

        const { log_tipo } = req.usuario;

        const paises = await dbConnection.query(`SELECT * FROM pais`, {
            model: Pais,
        });

        return res.json({
            result: paises,
            log_tipo: log_tipo,
            status: 1
        });


    } catch (error) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    }
}

// Notas en el controlador payout const (importarPayout-masivaPayout-notificarTodo-deleteRef-editarRef-verMotivo) agregar el pais
const paisesDashboard = (pais) =>{

    if(pais == 1){
        return ` AND s.currency = "COP" `;
    }else if(pais == 2){
        return ` AND s.currency = "SOL" `;
    }else{
        return '';
    }

}

const paisesDashboard2 = (pais) =>{

    if(pais == 1){
        return ` AND currency = "COP" `;
    }else if(pais == 2){
        return ` AND currency = "SOL" `;
    }else{
        return '';
    }

}

const paisesAliados = (pais) => {
    
    if(pais == 0){
        return '';
    }else{
        return ` AND a.pais = ${pais} `;
    }
   
}


const paisesPayout = (pais) =>{

    if(pais == 1){
        return ` AND m.currency = "COP" `;
    }else if(pais == 2){
        return ` AND m.currency = "SOL" `;
    }else{
        return '';
    }

}

const paisesFiltroPayout = (pais) =>{

    if(pais == 1){
        return ' LEFT JOIN masiva a ON a.reference = m.reference ';
    }else if(pais == 2){
        return ' LEFT JOIN masivaperu a ON a.reference = m.reference ';
    }else{
        return '';
    }

}


const paisesBalance = (pais) => {
    
    if(pais == 0){
        return '';
    }else{
        return `AND d.pais = ${pais}`;
    }
   
}


//cambiar cashin - EstadoMovimiento aqui hayq validar porq salen todos los estados


//crear gastos por paises

module.exports = {
    verPais,
    paisesDashboard,
    paisesDashboard2,
    paisesAliados,
    paisesPayout,
    paisesFiltroPayout,
    paisesBalance
}