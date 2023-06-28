const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { tablePayout,
        pagarPayout, 
        rechazarPayout, 
        importarPayout, 
        successPayout, 
        masivaPayout, 
        msgPayout, 
        notificarTodo,
        filtroPayout,
        pagosPayout,
        pruebafecha,
        deleteRef,
        editarRef,
        verMotivo,
        estadoSolicitud
     } = require('../controllers');

const { validarJWT, rolDashboard} = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/table', jsonParser,[
    validarJWT,
], tablePayout );

router.put('/pagar/:id', jsonParser,[
    validarJWT,
], pagarPayout );

router.put('/rechazar/:id', jsonParser,[
    validarJWT,
], rechazarPayout );


router.post('/importar', jsonParser,[
    validarJWT,
], importarPayout );


router.post('/success', jsonParser,[
    validarJWT,
], successPayout );

router.get('/masiva', jsonParser,[
    validarJWT,
], masivaPayout );

router.post('/msgmasiva', jsonParser,[
    validarJWT,
], msgPayout );

router.post('/notificar', jsonParser,[
    validarJWT
], notificarTodo );

router.post('/filtro', jsonParser,[
    validarJWT,
], filtroPayout );

router.post('/pagos', jsonParser,[
    validarJWT,
], pagosPayout );

router.get('/validarFecha', jsonParser,[
   
], pruebafecha );

router.put('/deleteRef/:id', jsonParser,[
    validarJWT,
], deleteRef );

router.put('/editarRef/:id', jsonParser,[
    validarJWT,
], editarRef );


router.post('/bucarmotivo', jsonParser,[
    validarJWT,
], verMotivo );

router.post('/estadoSol', jsonParser,[
    validarJWT,
], estadoSolicitud );

module.exports = router;