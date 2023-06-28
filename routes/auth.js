const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");

const { login, change } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares');

const router = Router();

const jsonParser = bodyParser.json();

router.post('/login', jsonParser,[
    check('user','El Usuario es obligatorio').isEmpty(),
    check('password','La contraseña es obligatoria').isEmpty(),
    validarCampos
], login );

router.post('/changepass', jsonParser,[
    check('passv','La contraseña actual es obligatoria').isEmpty(),
    check('passn','La contraseña nueva es obligatoria').isEmpty(),
    validarJWT,
    validarCampos
], change );



module.exports = router;