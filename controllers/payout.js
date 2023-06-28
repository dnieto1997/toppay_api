const { response, json } = require('express');
const { dbConnection } = require('../database/config');
const { Movimiento, MovEstado, Aliado, Masiva, MasivaPeru, Comparar } = require('../models');
const moment = require('moment'); 
const momentZone = require('moment-timezone'); 
const { paisesDashboard, paisesPayout, paisesFiltroPayout } = require('./paises');

const tablePayout = async (req, res = response) => {

    
    try {

        const { fecha1, fecha2, user = 0, aliado = 0} = req.query;
        const { log_tipo, log_merchantid, log_pais } = req.usuario;
        
        let consultUser = '';
        let consultAliado = '';
        let consultClient = '';

        let consultPais = paisesDashboard(log_pais);

        let tipoStatus = `AND s.status IN ('2')`;

        if(user != 0){
            consultUser = `AND s.user_doc =${user}`;
        }

        if(aliado != 0){
            consultAliado = `AND s.merchant_id =${aliado}`;
        }

        if(log_tipo != 'TE'){
            consultClient = '';
        }else{
            consultClient = `AND s.merchant_id = "${log_merchantid}" `;
            tipoStatus = '';
        }

        const movimiento = await dbConnection.query(`SELECT s.uid,
                                                            s.user_name,
                                                            s.user_email,
                                                            s.reference,
                                                            s.user_doc,
                                                            s.user_phone,
                                                            s.method,
                                                            s.currency,
                                                            DATE(s.created_at) AS fecha,
                                                            TIME(s.created_at) AS hora,
                                                            s.amount,
                                                            s.cost,
                                                            s.iva,
                                                            (s.amount*4/1000) As gmf,
                                                            s.user_bank,
                                                            s.user_type_account,
                                                            s.user_num_account,
                                                            s.merchant_name,
                                                            s.updated_at,
                                                            s.status,
                                                            IF(s.status = 1, "Success",
                                                                IF(s.status = 2, "Waiting", 
                                                                    IF(s.status = 3,"Declined","Error") ) ) AS estado,
                                                            m.motivo
                                                            FROM movimientos s
                                                                LEFT JOIN masiva m ON m.reference = s.reference
                                                                WHERE s.type_transaction='2'
                                                                AND DATE(s.created_at) BETWEEN "${fecha1}" AND "${fecha2}"
                                                                ${tipoStatus}
                                                                ${consultUser}
                                                                ${consultAliado}
                                                                ${consultClient}
                                                                ${consultPais}
                                                                GROUP BY s.uid,m.reference,m.motivo
                                                                ORDER BY s.uid desc `, {
                                                                        model: Movimiento,
                                                                    });

       
        return res.json({
            result: movimiento,
            log_tipo: log_tipo,
            pais: log_pais,
            status: 1
        });
       
       

    } catch (err) {
        
        return res.status(500).json({
            msg: `Erro de conexion base de datos ${err}`,
            status: 1
        });

    }
}

const pagarPayout = async (req, res = response) => {

    try {
        
        const { id } = req.params;
        const { id : user } = req.usuario;
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');
        //Buscar movimientos
        const movimientoB = await Movimiento.findAll({
            where: { uid: id },
        });
        
        //Buscar merchant id
        const aliados = await Aliado.findAll({
            where: { uid: movimientoB[0].merchant_id },
        })
        
        const movimiento = await dbConnection.query(`UPDATE movimientos 
                                                            SET status='1',
                                                            cost=${aliados[0].cashout}, 
                                                            iva= ${aliados[0].cashout} *${aliados[0].iva}, 
                                                            notify='E' 
                                                                WHERE uid = '${id}' 
                                                                AND method ='TUP_OUT'`);
 
        const data = {
            user:user,
            movimiento: id,
            date: fecha,
            tipo: "payout",
            estado: '1'
        }                                                       
        
        const movestado = new MovEstado(data);
 
        await movestado.save();
        

        //Curls
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
        "reference": movimientoB[0].reference,
        "status": "success",
        "method": "TUP_OUT"
        });

        const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch( aliados[0].url_response , requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    
                
        if(movimiento[0].changedRows == 0){
            return res.json({
                result: `Error al pagar id: ${id} esta Pagado`,
                status: 1,
            });
        }else{

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

const rechazarPayout = async (req, res = response) => {

    try {
        
        const { id : user, log_pais } = req.usuario;
       
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        const { id } = req.params;
        const { motivo } = req.body;

        //Buscar movimientos
        const movimientoB = await Movimiento.findAll({
            where: { uid: id },
        });
        
        //Buscar merchant id
        const aliados = await Aliado.findAll({
            where: { uid: movimientoB[0].merchant_id },
        });

        const dataMasiva = {
            reference: movimientoB[0].reference,
            status: 3,
            usuario: user,
            fecha: fecha,
            cost: aliados[0].cashout, 
            iva: aliados[0].cashout * aliados[0].iva,
            motivo: motivo
        }

        if(log_pais == 1 ){
            const saveMasiva = new Masiva(dataMasiva);
            await saveMasiva.save();
        } if(log_pais == 2 ){
            const saveMasiva = new MasivaPeru(dataMasiva);
            await saveMasiva.save();
        }

        
        const movimiento = await dbConnection.query(`UPDATE movimientos 
                                                        SET status ='3',
                                                        cost =${aliados[0].cashout}, iva=${aliados[0].cashout} *${aliados[0].iva}, 
                                                        notify ='E' 
                                                        WHERE uid ='${id}' 
                                                        AND method='TUP_OUT'`);
                
        const data = {
            user:user,
            movimiento: id,
            date: fecha,
            tipo: "payout",
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
         "method": "TUP_OUT",
         "errorMsg": motivo
         });
 
         const requestOptions = {
         method: 'POST',
         headers: myHeaders,
         body: raw,
         redirect: 'follow'
         };
 
         fetch( aliados[0].url_response , requestOptions)
         .then(response => response.text())
         .then(result => console.log(result))
         .catch(error => console.log('error', error));
        
        if(movimiento[0].changedRows == 0){
            return res.json({
                result: `Error al rechazar id: ${id}`,
                status: 1,
            });
        }else{

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

const importarPayout = async ( req, res = response ) => {

    try {
        
        const { arr } = req.body;
        const { id,log_pais } = req.usuario;

        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        if(arr == undefined){
            return res.json({
                msg: 'Seleccione un archivo xlxs',
                alert2: 2
            });
        }

        if(log_pais == 2){
            
            let newArr  = [];
    
            for await (let element of arr){
                newArr.push(`"${element.reference}"`);
            }

            const movimiento = await dbConnection.query(`
                SELECT  m.reference, 
                         a.cashout as costo, 
                         a.iva,
                         a.uid AS merchant,
                         a.url_response,
                         m.currency,
                         m.amount
                            FROM 
                                movimientos m 
                                    INNER JOIN  
                                        aliado a ON a.uid = m.merchant_id WHERE 
                                            m.reference in(${newArr})
            `, {
                model: Movimiento,
            });

            
            const resultado = movimiento.map( (mv)=>{
                
                const repetido = arr.filter( (rp)=>{
                    return rp.reference == mv.reference
                })[0]
            
                return {
                    reference: mv.dataValues.reference,
                    status: repetido.status,
                    usuario: id,
                    fecha: fecha,
                    cost: mv.dataValues.costo,
                    iva: mv.dataValues.iva,
                    url_response: mv.dataValues.url_response,
                    motivo: repetido.motivo,
                    currency: mv.dataValues.currency,
                    amount: mv.dataValues.amount
                }

            });

            const resp = await MasivaPeru.bulkCreate(resultado);

                   
            return res.json({
                msg: 'Importacion exitosa',
                /* arr:resp.length, */
                arr:movimiento,
                alert2: 1
            });

        }else{
           
            let newArr  = [];
    
            for await (let element of arr){
                newArr.push(`"${element.reference}"`);
            }

            const movimiento = await dbConnection.query(`
                SELECT  m.reference, 
                         a.cashout as costo, 
                         a.iva,
                         a.uid AS merchant,
                         a.url_response,
                         m.currency,
                         m.amount
                            FROM 
                                movimientos m 
                                    INNER JOIN  
                                        aliado a ON a.uid = m.merchant_id WHERE 
                                            m.reference in(${newArr})
            `, {
                model: Movimiento,
            });

            
            const resultado = movimiento.map( (mv)=>{
                
                const repetido = arr.filter( (rp)=>{
                    return rp.reference == mv.reference
                })[0]
            
                return {
                    reference: mv.dataValues.reference,
                    status: repetido.status,
                    usuario: id,
                    fecha: fecha,
                    cost: mv.dataValues.costo,
                    iva: mv.dataValues.iva,
                    url_response: mv.dataValues.url_response,
                    motivo: repetido.motivo,
                    currency: mv.dataValues.currency,
                    amount: mv.dataValues.amount
                }

            });
          
           
            const resp = await Masiva.bulkCreate(resultado);
            
            return res.json({
                msg: 'Importacion exitosa',
                arr:resp.length,
                alert2: 1
            });
            
        }

    } catch (error) {
         return res.json({
            result: [],
            msg: 'Error al importar '+error,
            alert2: 1
        });
    }
}

const estadoSolicitud = async ( req, res = response ) => {

    try {
        const { id, log_pais } = req.usuario;

        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        if(log_pais == 2){

        }else{
            
            const masivaNum = await Masiva.findAll({
                where: { msg: 1 },
            });


            return res.json({
                msg: 'Cambio de estado exitosa',
                result: masivaNum,
                alert2: 1
            });
        }


    } catch (error) {
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
            alert2: 1
        });
    }
}

const masivaPayout = async ( req, res = response ) => {

    try {
        
        const { id, log_pais } = req.usuario;

        if(log_pais == 2){

            const masivaNum = await MasivaPeru.findAll({
                where: { msg: 1 },
            });
    
            return res.json({
                msg: 'Importacion exitosa',
                result: masivaNum,
                alert2: 1
            });

        }else{

            const masivaNum = await Masiva.findAll({
                where: { msg: 1 },
            });

            return res.json({
                msg: 'Importacion exitosa',
                result: masivaNum,
                alert2: 1
            });

        }

    } catch (error) {
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
            alert2: 1
        });
    }
}

const msgPayout = async ( req, res = response ) => {

    try {
        const { id, status, reference } = req.body;
        const { log_pais } = req.usuario;

        if(status == 1 || status == 3){

            if(log_pais == 2){

                const masiva = await MasivaPeru.findByPk( id );
    
                let statusL = '';
        
                if(status == 1){
                    statusL = 'success';
                }else if(status == 3){
                    statusL = 'declined';
                }
               
                //Curls
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                    "reference": reference,
                    "ErrSms": masiva.motivo,
                    "status": statusL,
                    "currency": masiva.currency,
                    "amount": masiva.amount,
                    "method": "TUP_OUT"
                });

                const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch( aliados[0].url_response , requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
           

                return res.json({
                    msg: 'Cambio de estado exitoso',
                    result: statusL,
                    alert2: 1
                });

            }else{

                
                const masiva = await Masiva.findByPk( id );
    
                let statusL = '';
        
                if(status == 1){
                    statusL = 'success';
                }else if(status == 3){
                    statusL = 'declined';
                }
               
                //Curls
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                    "reference": reference,
                    "ErrSms": masiva.motivo,
                    "status": statusL,
                    "currency": masiva.currency,
                    "amount": masiva.amount,
                    "method": "TUP_OUT"
                });

                const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch( aliados[0].url_response , requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
           

                return res.json({
                    msg: 'Cambio de estado exitoso',
                    result: statusL,
                    alert2: 1
                });
            }
            
        }else{
            return res.json({
                msg: 'Estado no permitido',
                result: [],
                alert2: 2
            });
        }

    } catch (error) {
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
            alert2: 1
        });
    }
}


const notificarTodo = async ( req, res = response ) => {

    try {

        const { id, log_pais } = req.usuario;

        if(log_pais == 2){

            let respuesta = 0;
            const masivaNum2 = await MasivaPeru.findAll({
                where: { msg: 1 },
            });
    
            for await (let num of masivaNum2) {
    
                if(num.dataValues.status == 1 || num.dataValues.status == 3){
                   
                    
                    const masiva = await MasivaPeru.findByPk( num.dataValues.id );
                    await masiva.update({msg:2});
                    respuesta++;
                    //Buscar movimientos

                    let statusL = '';
            
                    const hacermovimiento = await Movimiento.update({
                        status: num.dataValues.status,
                        notify: 'E',
                        cost: num.dataValues.cost,
                        iva: num.dataValues.cost * num.dataValues.iva
                      /*   updated_at: fecha */
                    },
                    {
                        where: {  reference: num.dataValues.reference }
                    });

                    if(num.dataValues.status == 1){
                        statusL = 'success';
                    }else if(num.dataValues.status == 3){
                        statusL = 'declined';
                    }
    
                        //Curls
                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
        
                        const raw = JSON.stringify({
                            "reference": num.dataValues.reference,
                            "ErrSms": num.dataValues.motivo,
                            "status": statusL,
                            "currency": num.dataValues.currency,
                            "amount": num.dataValues.amount,
                            "method": "TUP_OUT"
                        });
        
                        const requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                        };
        
                        fetch(  num.dataValues.url_response , requestOptions)
                        .then(response => response.text())
                        .then(result => console.log(result))
                        .catch(error => console.log('error', error));
                }
            }
    
            return res.json({
                msg: 'Importacion exitosa',
                result: respuesta,
                alert2: 1
            });

        }else{

            let respuesta = 0;
            const masivaNum = await Masiva.findAll({
                where: { msg: 1 },
            });
            for await (let num of masivaNum) {
               
                if(num.dataValues.status == 1 || num.dataValues.status == 3){
                   
                    
                    const masiva = await Masiva.findByPk( num.dataValues.id );
                    await masiva.update({msg:2});
                    respuesta++;
                    //Buscar movimientos

                    let statusL = '';
            
                    const hacermovimiento = await Movimiento.update({
                        status: num.dataValues.status,
                        notify: 'E',
                        cost: num.dataValues.cost,
                        iva: num.dataValues.cost * num.dataValues.iva
                      /*   updated_at: fecha */
                    },
                    {
                        where: {  reference: num.dataValues.reference }
                    });

                    if(num.dataValues.status == 1){
                        statusL = 'success';
                    }else if(num.dataValues.status == 3){
                        statusL = 'declined';
                    }
    
                        //Curls
                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
        
                        const raw = JSON.stringify({
                            "reference": num.dataValues.reference,
                            "status": statusL,
                            "ErrSms": num.dataValues.motivo,
                            "currency": num.dataValues.currency,
                            "amount": num.dataValues.amount,
                            "method": "TUP_OUT"
                        });
        
                        const requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                        };
        
                        fetch(  num.dataValues.url_response , requestOptions)
                        .then(response => response.text())
                        .then(result => console.log(result))
                        .catch(error => console.log('error', error));
                }
            }
    
            return res.json({
                msg: 'Importacion exitosa',
                result: respuesta,
                alert2: 1
            });
        }

      

    } catch (error) {
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
            alert2: 1
        });
    }
}

const successPayout = async ( req, res = response ) => {

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

        const movimiento = await dbConnection.query(`SELECT m.*,
                                                            DATE(m.created_at) AS fechac,
                                                            DATE(m.updated_at) AS fechau,
                                                            IF(m.status = 1,"Success","Declined") AS estados,
                                                            ('Buscando....') AS motivo
                                                            FROM movimientos m
                                                                WHERE m.type_transaction='2'
                                                                AND DATE(m.updated_at) BETWEEN "${fecha1}" AND "${fecha2}"
                                                                AND m.method = 'TUP_OUT'
                                                                ${sqlSuccess}
                                                                ${sqlAliado}
                                                                ${consultPais}
                                                                ORDER BY m.uid desc`, {
                                                                        model: Movimiento,
                                                                    });

        return res.json({
            result: movimiento,
            msg: 'Importacion exitosa',
            alert2: 1
        });
    } catch (error) {
        
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
            alert2: 1
        });

    }
}

const filtroPayout = async ( req, res= response ) => {

    try {

        const { reference = 0, cedula = 0, id = 0 } = req.body;
        const { log_tipo, log_merchantid, log_pais } = req.usuario;

        let sqlMi = '';
        let consultPais = paisesPayout(log_pais);
        let joinPais = paisesFiltroPayout(log_pais);

        if(reference != 0){
            sqlMi = `m.reference = "${reference}"` ;
        }else if(cedula != 0){
            sqlMi = `m.user_doc = "${cedula}"` ;
        }else if(id != 0){
            sqlMi = `m.uid = "${id}"` ;
        }

        if(sqlMi == ''){
            return res.json({
                result: [],
                alert2:1,
                msg: 'Seleccione una referencia / cedula / ID',
            });
        }

        const movimiento = await dbConnection.query(`
        SELECT m.*,
            DATE(m.updated_at) AS fecha,
            DATE( m.created_at ) AS fechacreacion,
            TIME( m.created_at ) AS horacreacion,
            DATE( m.updated_at ) AS fechactualizacion,
            TIME( m.updated_at ) AS horactualizacion,
            a.motivo
            FROM movimientos m
                ${joinPais}
                WHERE ${sqlMi} ${consultPais}`, {
                        model: Movimiento,
                    });

        return res.json({
            result: movimiento,
            alert2: 2
        });

    } catch (error) {
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
            alert2: 1
        });
    }
}

//Pendiente Pais - No recuerdo  de que se trara
const pagosPayout = async ( req, res= response ) => {

    try {
        const { arr } = req.body;

        if(!arr){
            return res.json({
                result: [],
                msg: 'Seleccione un documento',
                alert2: 1
            });
        }
        
        const trun = await Comparar.truncate();
        const resp = await Comparar.bulkCreate(arr);

        const movimiento = await dbConnection.query(`
        SELECT  m.uid, m.reference, m.merchant_name, m.amount, m.status
                FROM movimientos m
                    WHERE m.status IN(1,3)
                    AND EXISTS (SELECT c.reference FROM comparar c WHERE c.reference = m.reference);
        `, {
                    model: Movimiento,
                    mapToModel: true // pass true here if you have any mapped fields
        });
        


        return res.json({
            result: movimiento,
            msg: 'Error al importar',
            alert2: 2
        });

    } catch (error) {
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
            alert2: 1
        });
    }
}

//pruebo la fecha del servidor
const pruebafecha = async ( req, res= response ) => {

    try {
        
        const fecha =  momentZone().tz("America/Bogota").format('Y-MM-DD H:mm:ss');

        return res.json({
            result: fecha,
            alert2: 1
        });

    } catch (error) {
        
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
          
        });
    }
}

const deleteRef = async ( req, res= response ) => {

    try {
        
        const { reference } = req.body;
        const { log_pais } = req.usuario;

        if(log_pais == 1){
            const masiva = await Masiva.destroy({ where: { reference: reference } });
        }else if(log_pais == 2){
            const masiva = await MasivaPeru.destroy({ where: { reference: reference } });
        }

        const movimiento = await Movimiento.update({
            status: '2',
            notify: 'P'
        },
        {
            where: {  reference: reference }
        });

        return res.json({
            msg: `Referencia "${reference}" eliminada `,
            result: [],
            alert2: 1
        });

    } catch (error) {
        
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
          
        });

    }
}

const editarRef= async ( req, res= response ) => {

    try {
        
        const { motivo,status } = req.body;
        const { id : referencia } = req.params;
        const { id, log_tipo, log_pais } = req.usuario;
        
        if(log_pais == 2){
            const masiva = await MasivaPeru.update({
                status: status,
                motivo: motivo,
                usuario: id
            },
            {
                where: {  reference: referencia }
            });
        }else{
            const masiva = await Masiva.update({
                status: status,
                motivo: motivo,
                usuario: id
            },
            {
                where: {  reference: referencia }
            });
        }

        const movimiento = await Movimiento.update({
            status: status,
        },
        {
            where: {  reference: referencia }
        });

        return res.json({
            msg: `Referencia "${referencia}" editada `,
            result: movimiento,
            alert2: 1
        });

    } catch (error) {
        
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
        });

    }
}

const verMotivo = async ( req, res= response ) => {

    try {

        const { reference } = req.body;
        const { log_pais } = req.usuario;

        if(log_pais == 2){

            const masiva = await MasivaPeru.findAll({
                where: { reference: reference },
            });

            return res.json({
                msg: '',
                result: masiva,
                alert2: 1
            });

        }else{

            const masiva = await Masiva.findAll({
                where: { reference: reference },
            });

            return res.json({
                msg: '',
                result: masiva,
                alert2: 1
            });
        }


    } catch (error) {
        
        return res.json({
            result: [],
            msg: 'Error al importar '+error,
          
        });

    }
}


module.exports = {
    tablePayout,
    pagarPayout,
    rechazarPayout,
    importarPayout,
    successPayout,
    masivaPayout,
    notificarTodo,
    msgPayout,
    filtroPayout,
    pagosPayout,
    pruebafecha,
    deleteRef,
    editarRef,
    verMotivo,
    estadoSolicitud
}
