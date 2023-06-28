const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { tableCashin, cambiarEstadoMovimiento, cambiarEstadoMovimiento2 } = require('../controllers');

const { validarJWT, rolDashboard} = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/table', jsonParser,[
    validarJWT,
], tableCashin );

router.get('/estado/:reference/:estado', jsonParser,[
    validarJWT,
], cambiarEstadoMovimiento );

router.get('/estado2/:reference/:estado', jsonParser,[
    validarJWT,
], cambiarEstadoMovimiento2 );


module.exports = router;