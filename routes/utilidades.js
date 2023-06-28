const { Router } = require('express');
const bodyParser = require("body-parser");
const { tableUtilidades } = require('../controllers');
const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.post('/table', jsonParser,[validarJWT],tableUtilidades );

module.exports = router;