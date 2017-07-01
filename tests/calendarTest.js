/**
 * Created by FernandoA on 6/30/2017.
 */

var calendarModel = require('../models/calendarModel');
//var pjson = require('../../../package.json');

var testGet = true;

if (testGet) {
    /*
    var date = new Date();
    console.log(date);
    var result = calendarModel.getEventTypes().then(
        function (result) {
            console.log(result);
            //resolve(result);
        },
        function (error) {
            console.log('Error:' + error);
        }
    );
    */
    var param = {
        caseId : 1
    };
    var result = calendarModel.getEventsByCaseId(param).then(
        function (result) {
            console.log(result);
            //resolve(result);
        },
        function (error) {
            console.log('Error:' + error);
        }
    );
}