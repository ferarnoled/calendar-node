/**
 * Created by FernandoA on 4/16/2017.
 */
var metaDataModel = require('../models/metaData');
//var pjson = require('../../../package.json');

var testGet = true;

if (testGet) {
var result = metaDataModel.getCities().then(
    function (result) {
        console.log(result);
        resolve(result);
    },
    function (error) {
        console.log('Error:' + error);
    }
);

}