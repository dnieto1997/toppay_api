const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { crearDispersiones, verBancos, verDispersiones,eliminarDispersiones, gmfDispersiones } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/ver', jsonParser,[
    validarJWT,
], verDispersiones );

router.post('/crear', jsonParser,[
    validarJWT,
], crearDispersiones );

router.post('/bancos', jsonParser,[
    validarJWT,
], verBancos );

router.delete('/eliminar/:id', jsonParser,[
    validarJWT,
], eliminarDispersiones );

router.post('/gmf', jsonParser,[
    validarJWT,
], gmfDispersiones );

module.exports = router;