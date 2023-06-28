const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { verGastos, crearGastos, editarGastos, eliminarGastos } = require('../controllers');

const { validarJWT, rolDashboard} = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/ver/:startDate/:endDate', jsonParser,[
    validarJWT,
], verGastos );

router.post('/crear', jsonParser,[
    validarJWT,
], crearGastos );

router.put('/editar/:id', jsonParser,[
    validarJWT,
], editarGastos );

router.delete('/eliminar/:id', jsonParser,[
    validarJWT,
], eliminarGastos );


module.exports = router;