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
/*
    var event = [
        {"eventId":"1"
            ,"eventName":"Event 2"
            ,"eventTypeName":"Physical Therapy"
            ,"location": {
            "locationName": "Peet' Coffe"
            , "address": "123 Main Street, Los Altos, CA 94022"
            , "phone": null
            , "latitude": "37.4738000"
            , "longitude": "-122.1916327"
        }
        ,"startDate":"2017-06-30T21:00:06.000Z"
        ,"endDate":"2017-06-30T22:00:06.000Z"
            ,"repeatRule":null
            ,"repeatEnds":null
            ,"reminder":null
            ,"notes":"My notes"}];
    calendarModel.saveEvent(event);
    */
}