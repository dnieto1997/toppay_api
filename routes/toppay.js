const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { saveToppay, verToppay,tablaToppay,recargaToppay, pruebacallback   } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/ver', jsonParser,[
    validarJWT,
], verToppay );

router.post('/tabla', jsonParser,[
    validarJWT,
], tablaToppay );

router.post('/guardar', jsonParser,[
    validarJWT,
], saveToppay );

router.post('/nequi', jsonParser,[
    validarJWT,
], recargaToppay );

router.post('/callbackprueba', jsonParser,[
    
], pruebacallback );


module.exports = router;