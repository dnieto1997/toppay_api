const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { enviarCallback } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.post('/enviar', jsonParser,[
    validarJWT,
], enviarCallback );

module.exports = router;