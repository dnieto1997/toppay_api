const validarcampos = require('./validar-campos');
const validarjwt = require('./validar-jwt');
const validarroles = require('./validar-roles');

module.exports = {
    ...validarcampos,
    ...validarjwt,
    ...validarroles
}