const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

const json =  require('body-parser');
const urlencoded =  require('body-parser');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            menu: '/api/menu',
            dashboard: '/api/dashboard',
            payout: '/api/payout',
            aliado: '/api/aliado',
            wallets: '/api/wallets',
            cashin: '/api/cashin',
            balance: '/api/balance',
            utilidades: '/api/utilidades',
            gastos: '/api/gastos',
            usuarios: '/api/usuarios',
            dispersiones: '/api/dispersiones',
            referencias: '/api/referencias',
            conciliacion: '/api/conciliacion',
            payoutPeru: '/api/payoutperu',
            pais: '/api/pais',
            listanegra: '/api/listanegra',
            toppay: '/api/toppay',
            callbackaliado: '/api/callbackaliado',
        }


        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.router();

        //lectura y Parseo body
        this.app.use( express.json() )
    }

    router(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.menu, require('../routes/menu'));
        this.app.use(this.paths.dashboard, require('../routes/dashboard'));
        this.app.use(this.paths.payout, require('../routes/payout'));
        this.app.use(this.paths.aliado, require('../routes/aliado'));
        this.app.use(this.paths.wallets, require('../routes/wallets'));
        this.app.use(this.paths.cashin, require('../routes/cashin'));
        this.app.use(this.paths.balance, require('../routes/balance'));
        this.app.use(this.paths.utilidades, require('../routes/utilidades'));
        this.app.use(this.paths.gastos, require('../routes/gastos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.dispersiones, require('../routes/dispersiones'));
        this.app.use(this.paths.referencias, require('../routes/referencias'));
        this.app.use(this.paths.conciliacion, require('../routes/conciliacion'));
        this.app.use(this.paths.payoutPeru, require('../routes/payoutperu'));
        this.app.use(this.paths.pais, require('../routes/pais'));
        this.app.use(this.paths.listanegra, require('../routes/listanegra'));
        this.app.use(this.paths.toppay, require('../routes/toppay'));
        this.app.use(this.paths.callbackaliado, require('../routes/callbackaliado'));
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log(this.port+ ' Puerto')
        })
    }

    async conectarDB(){
        await dbConnection;
    }

    middlewares(){

        this.app.use(json({ limit: '50mb' }));
        this.app.use(urlencoded({ extended: true, limit: '100mb' }));
        //cors
        this.app.use(cors())
        //Directorio punlico
        this.app.use( express.static('public') )
    }
}

module.exports = Server;