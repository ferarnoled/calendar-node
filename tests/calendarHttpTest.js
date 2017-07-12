/**
 * Created by FernandoA on 6/30/2017.
 */
"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../www/appLite');
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

var eventObj_16 = {
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

describe('calendar', function() {
    before((done) => {
        Promise.all([knex('locations').del()
            , knex('cal.events').del()
            , knex('cal.event_types').del()])
            .then((resp) => {
                console.log('Event rows deleted');
            }).catch((err) => {
                console.log('Error deleting events: ' + err);
        });
        done();
    });

    it('should add an event on /case/:caseId/events POST', (done) => {
        var caseId = 1;
        chai.request(server)
            .post('/cases/' + caseId + '/events')
            .send(eventObj_16)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.an('Object');
                res.body.should.have.property('success');
                res.body.should.have.property('status');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.data.should.be.an('string');
                res.body.data.should.have.property('eventId');
                res.body.data.eventId.should.equal(eventId);
                res.body.data.should.have.property('eventName');
                res.body.data.should.have.property('startDate');
                (new Date(res.body.data.startDate)).should.be.a('Date');
                res.body.data.should.have.property('endDate');
                (new Date(res.body.data.endDate)).should.be.a('Date');
                //console.log(res);
                done();
            });
    });

    it('should list all events for :caseId on /case/:caseId/events GET', function(done) {


        chai.request(server)
            .get('/cases/' + caseId + '/events/' + eventId)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.an('Object');
                res.body.should.have.property('success');
                res.body.should.have.property('status');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.data.should.be.an('object');
                res.body.data.should.have.property('eventId');
                res.body.data.eventId.should.equal(eventId);
                res.body.data.should.have.property('eventName');
                res.body.data.should.have.property('startDate');
                (new Date(res.body.data.startDate)).should.be.a('Date');
                res.body.data.should.have.property('endDate');
                (new Date(res.body.data.endDate)).should.be.a('Date');
                //console.log(res);
                done();
            });
    });
    it('should return a SINGLE event on /case/:caseId/events/:eventId GET');
    it('should update an event on /case/:caseId/events/:eventId PUT');
    it('should delete an event on /case/:caseId/events/:eventId DELETE');
});