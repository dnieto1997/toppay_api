const { response } = require('express');
const { Permission } = require('../models');

const rolDashboard = async ( req, res = response, next ) => {

    const { log_tipo } = req.usuario;

    const permisos = await Permission.findByPk(1);

    const {  roles } = permisos;

    const arrRoles = JSON.parse(roles);

    if( !arrRoles.includes( log_tipo ) ){
        return res.status(401).json({
            msg: `El servicio requier uno de estos roles ${ arrRoles } `,
            status: 2
        });
    }

    next();
}



module.exports = {
    rolDashboard,
}