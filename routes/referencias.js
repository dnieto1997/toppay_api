const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { importarReferencia } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.post('/importar', jsonParser,[
], importarReferencia );

module.exports = router;