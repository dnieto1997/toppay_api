const auth = require('./auth');
const dashboard = require('./dashboard');
const Menu = require('./menu');
const Payout = require('./payout');
const Aliado = require('./aliado');
const Wallets = require('./wallets');
const Cashin = require('./cashin');
const Balance = require('./balance');
const Utilidades = require('./utilidades');
const Gastos = require('./gastos');
const Usuarios = require('./usuarios');
const Disperciones = require('./dispersiones');
const Referencia = require('./referencia');
const Conciliacion = require('./conciliacion');
const PayoutPeru = require('./payoutPeru');
const Paises = require('./paises');
const Listanegra = require('./listanegra');
const Toppay = require('./toppay');
const Callbackaliado = require('./callbackaliado');

module.exports = {
    auth,
    ...dashboard,
    ...Menu,
    ...Payout,
    ...Aliado,
    ...Wallets,
    ...Cashin,
    ...Balance,
    ...Utilidades,
    ...Gastos,
    ...Usuarios,
    ...Disperciones,
    ...Referencia,
    ...Conciliacion,
    ...PayoutPeru,
    ...Paises,
    ...Listanegra,
    ...Toppay,
    ...Callbackaliado
}