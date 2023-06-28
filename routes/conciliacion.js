const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { conciliacionMethod, conciliacionMovimiento, conciliacionBuscar, conciliacionEditar } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/verMethod', jsonParser,[
    validarJWT,
], conciliacionMethod );

router.post('/buscarMovimiento', jsonParser,[
    validarJWT,
], conciliacionMovimiento );

router.post('/buscarConsiliacion', jsonParser,[
    validarJWT,
], conciliacionBuscar );

router.post('/editarMovimiento', jsonParser,[
    validarJWT,
], conciliacionEditar );

module.exports = router;