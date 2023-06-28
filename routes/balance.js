const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { verbalance, buscarbalance } = require('../controllers');

const { validarJWT, rolDashboard} = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/ver', jsonParser,[
    validarJWT,
], verbalance );

router.post('/buscar',jsonParser,[
    validarJWT,
], buscarbalance );


module.exports = router;