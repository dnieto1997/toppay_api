const { response } = require('express');
const { dbConnection } = require('../database/config');
const { Historypayout } = require('../models');
const moment = require('moment'); 

const verTodoWallet = async (req, res = response) => {

    const { id = 0 } = req.params;

    try {
        const aliados = await dbConnection.query(`SELECT *
                                                        FROM wallets
                                                            WHERE status = 1
                                                            AND type_account = 1
                                                            AND merchant_id = ${id}`);

        return res.json({
            result: aliados[0],
            status: 1
           
        });

    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const verTodoWalletId = async (req, res = response) => {

    const { id = 0 } = req.params;

    try {
        const aliados = await dbConnection.query(`SELECT *
                                                        FROM wallets
                                                            WHERE uid = ${id}`);

        return res.json({
            result: aliados[0],
            status: 1
           
        });

    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const saveWallet = async (req, res = response) => {

    const { merchant_id,account_id,type_account = 0, banck = 0, num_account = 0, amount, total } = req.body;
    const { id : user } = req.usuario;
    const fecha = moment().format('Y-M-D h:mm:ss');

    try {

        const aliados = await dbConnection.query(`SELECT *
                                                    FROM wallets
                                                        WHERE status = 1
                                                        AND type_account = 2
                                                        AND merchant_id = ${merchant_id}`);
        if(account_id != 0){
            if(aliados[0].length == 0){

                return res.json({
                result: aliados[0],
                msg: `El Aliado no cuenta con una cuenta Payout`,
                status: 1

                }); 

            }else{
                
                let sumar  = Number(aliados[0][0].amount) + amount;
                let restar = (total - amount);

                const actSumar = await dbConnection.query(`UPDATE wallets 
                                                                SET amount='${sumar}'
                                                                    WHERE uid = '${ aliados[0][0].uid }' `);
                
                const actRestar = await dbConnection.query(`UPDATE wallets 
                                                                    SET amount='${restar}'
                                                                        WHERE uid = '${ account_id }' `);

                const data = {
                    merchant_id:merchant_id,
                    account_id: account_id,
                    type_account: type_account,
                    banck: banck,
                    num_account: num_account,
                    amount: amount,
                    payout: Number(aliados[0][0].amount),
                    cashin: total,
                    date_create: fecha,
                    user_create: user,
                    status: '1'
                }          
                                                                
                const history = new Historypayout(data);
                                                                
                await history.save();

                return res.json({
                    result:history,
                    msg: `Payout Registrado`,
                    status: 1
                   
                });
            }
        }else{

            let sumar  = Number(aliados[0][0].amount) + amount;

            const actSumar = await dbConnection.query(`UPDATE wallets 
                                                            SET amount='${sumar}'
                                                                WHERE uid = '${ aliados[0][0].uid }' `);

            const data = {
                merchant_id:merchant_id,
                account_id: account_id,
                type_account: type_account,
                banck: banck,
                num_account: num_account,
                amount: amount,
                payout: Number(aliados[0][0].amount),
                cashin: total,
                date_create: fecha,
                user_create: user,
                status: '1'
            }          
    
            const history = new Historypayout(data);
    
            await history.save();
    
            return res.json({
                result: history,
                msg: `Payout Registrado`,
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
    verTodoWallet,
    verTodoWalletId,
    saveWallet
}