const Sequelize = require('sequelize');


/* const dbConnection = new Sequelize('toppay','root', '', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false
}); */


/* const dbConnection = new Sequelize('u293118005_toppay','u293118005_toppay', '6v/BkR+=n4]74s9q8498', {
    host: 'sql465.main-hosting.eu',
    dialect: 'mysql',
    //logging: false
}); */

const dbConnection = new Sequelize('toppay','hostToppay', 'Tecnologia2022@', {
    host: '129.213.170.8',
    dialect: 'mysql',
    //logging: false
});

console.log('Base de datos online ')

module.exports = {
    dbConnection
}