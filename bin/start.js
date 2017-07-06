/**
 * Created by FernandoA on 4/16/2017.
 */

let routes = require('../routes/routes');

require('../www/www').start({
    port: '3050',
    serviceName: 'outpatient-main',
    routes: routes
});