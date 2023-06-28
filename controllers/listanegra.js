const { response } = require('express');
const { dbConnection } = require('../database/config');
const { Usuario,TipoUser } = require('../models');
const bcriptjs = require('bcryptjs');
const ListaNegra = require('../models/listanegra');

const moment = require('moment'); 
const momentZone = require('moment-timezone'); 

const importarListanegra = async (req, res = response) => {

    try {
        
        const { arr=[] } = req.body;

        const arrCount = arr.length;
       
        if(arrCount == 0){
            return res.json({
                msg: 'Seleccione un archivo xlxs',
                arr:arrCount,
                alerta: 2
            });
        }

        const bdLista = await ListaNegra.findAll();

        const resultado = arr.map( (mv)=>{
            const repetido = bdLista.filter( (rp)=>{
                if( rp.cedula == mv.userdoc ){
                    
                    return rp.cedula == mv.userdoc
                }
            })[0]

            let varRepetido = 'NO';

            if(repetido){
                varRepetido = 'SI';
            }
           
            return {
                eliminar: varRepetido,
                id: mv.id,
                Aliado: mv.Aliado,
                username: mv.username,
                useremail: mv.useremail,
                reference: mv.reference,
                userdoc: mv.userdoc,
                userphone: mv.userphone,
                method: mv.method,
                date: mv.date,
                amount: mv.amount,
                currency: mv.currency,
                userbank: mv.userbank,
                usertypeaccount: mv.usertypeaccount,
                usernumaccount: mv.usernumaccount,
                cost: mv.cost,
                iva: mv.iva,
                status: mv.status,
                motivo: mv.motivo,
            }

        });

        return res.json({
            result: resultado,
            status: 1,
            msg:'Verificaion exitosa',
            alerta:1
        }); 

    } catch (err) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    } 

}

const verListanegra = async (req, res = response) => {

    try {
        
        const bdLista = await ListaNegra.findAll();

        return res.json({
            result: bdLista,
            status: 1,
            msg:'Busqueda exitosa',
            alerta:1
        }); 

    } catch (err) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    } 

}

const crearListanegra = async (req, res = response) => {

    try {
        const { cedula } = req.body;
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        const data = {
            cedula:cedula,
            fecha: fecha,
        }        

        const lista = new ListaNegra(data);
        await lista.save();

        return res.json({
            result: lista,
            status: 1,
            msg:'Creacion exitosa',
            alerta:1
        }); 

    } catch (err) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    } 

}

const editarListanegra= async (req, res = response) => {

    try {
        const { id, cedula } = req.body;
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        const lista = await ListaNegra.findByPk( id );

        if( !lista ){
            return res.status(404).json({
                msg: 'No existe la cedula '+cedula,
                alerta:2,
            })
        }

        await lista.update({
            id,
            cedula,
            fecha:fecha
        });

        return res.json({
            result: lista,
            status: 1,
            msg:'Edicion exitosa',
            alerta:1
        }); 

    } catch (err) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    } 

}

const eliminarListanegra= async (req, res = response) => {

    try {
        const { id } = req.body;

        await ListaNegra.destroy({
            where: {
                id:id
            }
        })

        return res.json({
            result: ListaNegra,
            status: 1,
            msg:'Edicion exitosa',
            alerta:1
        }); 

    } catch (err) {
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });
    } 

}


module.exports = {
    importarListanegra,
    verListanegra,
    crearListanegra,
    editarListanegra,
    eliminarListanegra
}