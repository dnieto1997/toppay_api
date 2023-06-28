const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { verPais } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/ver', jsonParser,[
    validarJWT,
], verPais );


module.exports = router;