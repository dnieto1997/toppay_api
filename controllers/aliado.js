const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Aliado } = require('../models');
const jwt = require("jsonwebtoken");
const moment = require('moment');
const momentZone = require('moment-timezone');
const { paisesAliados } = require('./paises');

const verTodoAliado = async (req, res = response) => {

    /*  const { fecha1, fecha2, user = 0 } = req.query; */
    const { log_pais } = req.usuario;


    let consultPais = paisesAliados(log_pais);

    try {
        const aliados = await dbConnection.query(`SELECT a.*, w.amount
                                                        FROM aliado a
                                                            LEFT JOIN wallets w ON w.merchant_id = a.uid AND w.type_account = 2
                                                            WHERE a.status = 1
                                                            ${consultPais}`, {
            model: Aliado,
            mapToModel: true // pass true here if you have any mapped fields
        });

        return res.json({
            result: aliados,
            status: 1
        });

    } catch (err) {

        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const perfilAliado = async (req, res = response) => {

    try {

        const { log_tipo, log_merchantid, log_pais } = req.usuario;

        let consultClient = '';
        let consultPais = paisesAliados(log_pais);
        let consultPeru = '';

        if (log_tipo != 'TE') {
            consultClient = '';
        } else {
            consultClient = `AND merchant_id = "${log_merchantid}" `;
        }

        const aliados = await dbConnection.query(`SELECT a.*, w.amount
                                                         FROM aliado a
                                                             LEFT JOIN wallets w ON w.merchant_id = a.uid AND w.type_account = 2
                                                             WHERE a.status = 1
                                                             ${consultPais}
                                                             ${consultClient} `, {
            model: Aliado,
            mapToModel: true // pass true here if you have any mapped fields
        });

        return res.json({
            result: aliados,
            status: 1
        });

    } catch (err) {

        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const crearAliado = async (req, res = response) => {

    try {

        const fecha = momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        const {
            merchant,
            email,
            pais,
            status = 1, } = req.body;

        const verificarAliado = await Aliado.findAll({
            where: { merchant: merchant },
        });

        if (verificarAliado.length > 0) {
            return res.status(200).json({
                result: verificarAliado.length,
                alert2: 1,
                msg: `El Merchant ${merchant} se encuentra registrado`,
            });
        }

        let pse_fijo = "450.00";
        let pse_porcentaje = "0.00";
        let nequi_fijo = "450.00";
        let nequi_porcentaje = "0.80";
        let cashout = "0.80";
        let banco = "1";
        let wallet_cashin = "20.00";
        let wallet_cashout = "0.00";
        let iva = "0.00";

        if (pais == 1) {
            pse_porcentaje = "0.80";
            cashout = "5000.00";
            iva = "0.19";
        } else if (pais == 2) {
            pse_porcentaje = "3.00";
            cashout = "3.80";
            iva = "0.18";
        }

        const data = {
            token: "",
            image: "",
            merchant: merchant,
            email: email,
            phone: "",
            url_response: "",
            pse_fijo: pse_fijo,
            pse_porcentaje: pse_porcentaje,
            nequi_fijo: nequi_fijo,
            nequi_porcentaje: nequi_porcentaje,
            cashout: cashout,
            banco: banco,
            wallet_cashin: wallet_cashin,
            wallet_cashout: wallet_cashout,
            iva: iva,
            pais: pais,
            status: status,
            created_at: fecha,
            updated_at: fecha,
        }

        const aliado = new Aliado(data);
        await aliado.save();

        const buscarAliado = await Aliado.findAll({
            where: { merchant: merchant },
        });

        const token = jwt.sign({ merchant: buscarAliado[0].id }, process.env.JWT_SECRET);

        const editarAliado = await Aliado.update({
            token: token,
        },
            {
                where: { id: buscarAliado[0].id }
            });

        return res.json({
            result: aliado,
            alert2: 2,
            msg: `Aliado registrado `,
            status: 1
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Error de conexion base de datos ${error}`,
            status: 1
        });
    }
}

module.exports = {
    verTodoAliado,
    perfilAliado,
    crearAliado
}