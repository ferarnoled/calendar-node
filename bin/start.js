/**
 * Created by FernandoA on 4/16/2017.
 */

let routes = require('../routes/routes');

require('../www/WWW').start({
    port: '3040',
    serviceName: 'outpatient-main',
    routes: routes
});