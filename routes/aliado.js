const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { verTodoAliado, perfilAliado, crearAliado } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/todos', jsonParser,[
    validarJWT,
], verTodoAliado );

router.get('/perfil', jsonParser,[
    validarJWT,
], perfilAliado );

router.post('/crear', jsonParser,[
    validarJWT,
], crearAliado );

module.exports = router;