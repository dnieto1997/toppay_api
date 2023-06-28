const { response, json } = require('express');
const moment = require('moment'); 
const momentZone = require('moment-timezone'); 

const enviarCallback = async (req, res = response) => {

    const { reference,status,amount, referenceid, method, aliado } = req.body;

    try {

        let arr = {
            reference,status,amount, referenceid, method, aliado
        }

        if(!reference || !status || !amount || !referenceid || !method || !aliado ){
            return res.status(400).json({
                resp: `digite los campos necesario`,
                status: 'error'
            });
        }
         //Curls
         const myHeaders = new Headers();
         myHeaders.append("Content-Type", "application/json");
 
         const raw = JSON.stringify({
         "reference":reference,
         "status": status,
         "amount":  amount,
         "referenceid": referenceid,
         "method": method
         });
 
         const requestOptions = {
         method: 'POST',
         headers: myHeaders,
         body: raw,
         redirect: 'follow'
         };
 
         fetch( aliado , requestOptions)
         .then(response => response.text())
        .then((result) =>{
            
            return res.status(200).json({result});
        })
        .catch(error => {
            
            return res.status(400).json({error});
        });
 

       

    } catch (err) {
        
        return res.status(500).json({
            resp: `Erro de conexion base de datos ${err}`,
            status: 'error'
        });

    }
}

module.exports = {
    enviarCallback
}