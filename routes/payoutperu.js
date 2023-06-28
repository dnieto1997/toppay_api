const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { tablePayoutPeru,
        pagarPayoutPeru, 
        rechazarPayoutPeru, 
       } = require('../controllers');

const { validarJWT, rolDashboard} = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.post('/table', jsonParser,[
    validarJWT,
], tablePayoutPeru );

router.put('/pagar/:id', jsonParser,[
    validarJWT,
], pagarPayoutPeru );

router.post('/rechazar/:id', jsonParser,[
    validarJWT,
], rechazarPayoutPeru );


module.exports = router;