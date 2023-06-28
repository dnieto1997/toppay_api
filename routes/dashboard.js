const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require("body-parser");

const { todayMoneyIn, 
        todaysTransactionIn, 
        todaysTransactionErrorIn,
        todayMoneyOut,
        todaysTransactionOut,payOutDashboard } = require('../controllers');

const { validarJWT, rolDashboard} = require('../middlewares');

const router = Router();

const jsonParser = bodyParser.json();

router.get('/todaymoneyin', jsonParser,[
    validarJWT,
    
  /*   check('user','El Usuario es obligatorio').isEmpty(),
    check('password','La contraseña es obligatoria').isEmpty(),
    validarcampos.validarCampos */
], todayMoneyIn );




router.get('/payOutDashboard', jsonParser,[
  validarJWT,
  
/*   check('user','El Usuario es obligatorio').isEmpty(),
  check('password','La contraseña es obligatoria').isEmpty(),
  validarcampos.validarCampos */
], payOutDashboard );



router.get('/todaystransactionin', jsonParser,[
  validarJWT,
  
/*   check('user','El Usuario es obligatorio').isEmpty(),
  check('password','La contraseña es obligatoria').isEmpty(),
  validarcampos.validarCampos */
], todaysTransactionIn );

router.get('/todaystransactionerrorin', jsonParser,[
  validarJWT,
  
/*   check('user','El Usuario es obligatorio').isEmpty(),
  check('password','La contraseña es obligatoria').isEmpty(),
  validarcampos.validarCampos */
], todaysTransactionErrorIn );

router.get('/todaymoneyout', jsonParser,[
  validarJWT,
  
/*   check('user','El Usuario es obligatorio').isEmpty(),
  check('password','La contraseña es obligatoria').isEmpty(),
  validarcampos.validarCampos */
], todayMoneyOut );

router.get('/todaystransactionout', jsonParser,[
  validarJWT,
  
/*   check('user','El Usuario es obligatorio').isEmpty(),
  check('password','La contraseña es obligatoria').isEmpty(),
  validarcampos.validarCampos */
], todaysTransactionOut );


module.exports = router;