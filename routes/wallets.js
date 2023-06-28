const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");
const { verTodoWallet, verTodoWalletId, saveWallet } = require('../controllers');

const { validarJWT } = require('../middlewares');

const router = Router();
const jsonParser = bodyParser.json();

router.get('/todos/:id', jsonParser,[
    validarJWT,
], verTodoWallet );

router.get('/id/:id', jsonParser,[
    validarJWT,
], verTodoWalletId );

router.post('/save', jsonParser,[
    validarJWT,
], saveWallet );

module.exports = router;