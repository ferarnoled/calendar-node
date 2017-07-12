/**
 * Created by FernandoA on 6/30/2017.
 */
"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../www/appLite');
var calendarModel = require('../models/calendarModel');
var should = chai.should();

var dbconfig = require('../config/config.json')[process.env.NODE_ENV || 'dev'];
/*
 pg.types.setTypeParser(1114, function(stringValue) {
 console.log(stringValue);
 return new Date(Date.parse(stringValue + "+0000"));
 })
 */
var knex = require('knex')({
    client: 'pg',
    connection: {
        host : dbconfig.host,
        user : dbconfig.username,
        password : dbconfig.password,
        database : dbconfig.database
    }
});

chai.use(chaiHttp);

// var calendarModel = require('../models/calendarModel');
// var pjson = require('../../../package.json');

var insertedEventId = null, caseId = 1;
var baseEventObj = {
    "event_name": "Event 17",
    "event_type_name": "Generic",
    "location": {
        "location_name": "Peet's Coffe",
        "address": "123 Main Street, Los Altos, CA 94022",
        "phone": null,
        "latitude": "37.4738000",
        "longitude": "-122.1916327"
    },
    "all_day": true,
    "start_date": new Date("2017-07-30T21:00:06.000Z"),
    "end_date": new Date("2017-07-30T22:00:06.000Z"),
    "repeat": {
        "frequency": 4,
        "interval": null,
        "endDate": null
    },
    "reminder": 3,
    "transportation": null,
    "notes": "My notes"
};


describe('calendar', function() {

    beforeEach((done) => {
        Promise.all([knex('cal.events').del()
            , knex('locations').del()
            , knex('cal.event_types').del()])
            .then((resp) => {
                console.log('Events deleted.');
                done();
            }).catch((err) => {
                console.log('Error deleting events: ' + err);
        });

    });

    it('should add an event on /case/:caseId/events POST', (done) => {
        let eventObj_16 = {
            "eventId": 16,
            "eventName": "Event 16",
            "eventTypeName": "Physical Therapy",
            "location": {
                "location_name": "Peet' Coffe",
                "address": "123 Main Street, Los Altos, CA 94022",
                "phone": null,
                "latitude": "37.4738000",
                "longitude": "-122.1916327"
            },
            "allDay": false,
            "startDate": new Date("2017-06-30T21:00:06.000Z"),
            "endDate": new Date("2017-06-30T22:00:06.000Z"),
            "repeat": {
                "frequency": null,
                "interval": null,
                "endDate": null
            },
            "reminder": null,
            "transportation": null,
            "notes": "My notes"
        };
        chai.request(server)
            .post('/cases/' + caseId + '/events')
            .send(eventObj_16)
            .end(function(err, res){
                console.log(res.body.error);
                res.should.have.status(200);
                res.body.should.be.an('Object');
                res.body.should.have.property('success');
                res.body.should.have.property('status');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.success.should.be.a('boolean')
                res.body.data.should.be.an('string');
                var insertedEventId = res.body.data;
                done();
            });
    });

    it('should list all events for :caseId on /case/:caseId/events GET', function(done) {
        let eventObj_17 = JSON.parse(JSON.stringify(baseEventObj));

        calendarModel.saveEvent(eventObj_17, caseId).then((result) => {
            chai.request(server)
                .get('/cases/' + caseId + '/events')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('status');
                    res.body.should.have.property('error');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(1);
                    res.body.data[0].should.have.property('eventId');
                    res.body.data[0].eventId.should.equal(parseInt(result));
                    done();
                });
        });
    });
    it('should return a SINGLE event on /case/:caseId/events/:eventId GET', function(done) {
        let eventObj_17 = JSON.parse(JSON.stringify(baseEventObj));

        calendarModel.saveEvent(eventObj_17, caseId).then((result) => {
            chai.request(server)
                .get('/cases/' + caseId + '/events/' + result)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('status');
                    res.body.should.have.property('error');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('object');
                    res.body.data.should.have.property('eventId');
                    res.body.data.eventId.should.equal(parseInt(result));
                    res.body.data.should.have.property('eventName');
                    res.body.data.should.have.property('startDate');
                    (new Date(res.body.data.startDate)).should.be.a('Date');
                    res.body.data.should.have.property('endDate');
                    (new Date(res.body.data.endDate)).should.be.a('Date');
                    res.body.data.should.have.property('allDay');
                    res.body.data.allDay.should.be.an('boolean');
                    res.body.data.should.have.property('location');
                    res.body.data.location.should.be.an('Object');
                    res.body.data.location.should.have.property('phone');
                    should.equal(res.body.data.location.phone, null);
                    res.body.data.location.should.have.property('latitude');
                    parseFloat(res.body.data.location.latitude).should.be.an('number');
                    done();
                });
        });
    });

    it('should update an event on /case/:caseId/events/:eventId PUT', function (done) {
        let eventObj_17 = JSON.parse(JSON.stringify(baseEventObj));

        calendarModel.saveEvent(eventObj_17, caseId).then((result) => {
            eventObj_17.all_day = false;
            eventObj_17.start_date = new Date("2018-07-30T21:00:06.000Z");
            eventObj_17.location.phone = "444444444";
            eventObj_17.reminder = 3;
            eventObj_17.location.latitude = "37.4738000";
            chai.request(server)
                .put('/cases/' + caseId + '/events/' + result)
                .send(eventObj_17)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('status');
                    res.body.should.have.property('error');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('string');

                    calendarModel.getEventByEventId(result).then((eventDb) => {
                        eventDb.should.have.property('eventId');
                        eventDb.eventId.should.equal(parseInt(result));
                        eventDb.allDay.should.equal(eventObj_17.all_day);
                        eventDb.startDate.getTime().should.equal(eventObj_17.start_date.getTime());
                        eventDb.location.phone.should.equal(eventObj_17.location.phone);
                        eventDb.reminder.should.equal(eventObj_17.reminder);
                        eventDb.location.latitude.should.equal(eventObj_17.location.latitude);
                        done();
                    });
                });
        });

    });
    it('should delete an event on /case/:caseId/events/:eventId DELETE', function(done) {
        let eventObj_17 = JSON.parse(JSON.stringify(baseEventObj));

        calendarModel.saveEvent(eventObj_17, caseId).then((result) => {
            chai.request(server)
                .delete('/cases/' + caseId + '/events/' + result)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.an('Object');

                    calendarModel.getEventByEventId(result).then((eventDb) => {
                        should.equal(eventDb, null);
                        done();
                    });
                });
        });

    });
});