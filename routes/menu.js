const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { menu } = require('../controllers');

const { validarJWT, rolDashboard} = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/', jsonParser,[
    validarJWT,
], menu );

module.exports = router;