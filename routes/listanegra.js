const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { importarListanegra, verListanegra, crearListanegra, editarListanegra,eliminarListanegra } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();


router.post('/importar', jsonParser,[
    validarJWT,
], importarListanegra );

router.get('/ver', jsonParser,[
    validarJWT,
], verListanegra );

router.post('/crear', jsonParser,[
    validarJWT,
], crearListanegra );

router.post('/editar', jsonParser,[
    validarJWT,
], editarListanegra );

router.post('/eliminar', jsonParser,[
    validarJWT,
], eliminarListanegra );

module.exports = router;