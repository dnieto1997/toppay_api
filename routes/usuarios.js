const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { verUsuario, 
        deleteUsuario, 
        crearUsuario, 
        verTipo, 
        editarUsuario,
        passwordUsuario, 
        cambiarEstado } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/ver', jsonParser,[
    validarJWT,
], verUsuario );

router.get('/cambiarpais/:pais', jsonParser,[
    validarJWT,
], cambiarEstado );

router.post('/crear', jsonParser,[
    validarJWT,
], crearUsuario );

router.delete('/eliminar/:id', jsonParser,[
     validarJWT,
], deleteUsuario );

router.put('/editar/:id', jsonParser,[
    validarJWT,
], editarUsuario );

router.put('/password/:id', jsonParser,[
    validarJWT,
], passwordUsuario );

router.get('/tipo', jsonParser,[
    validarJWT,
], verTipo );

module.exports = router;