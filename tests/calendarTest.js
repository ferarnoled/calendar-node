/**
 * Created by FernandoA on 6/30/2017.
 */
"use strict";

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var model = require('../models/calendarModel');
var should = chai.should();

chai.use(chaiAsPromised);

var eventId_16 = 16;
var caseId_1 = 1;
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
    it('should list all events for :caseId on /case/:caseId/events GET');
    it('should return a SINGLE event on /case/:caseId/events/:eventId GET', function(done) {
        model.getEventByEventId(eventId_16).should.eventually.be.an('object')
            .and.eventually.be.deep.equal(eventObj_16)
            .notify(done);
    });
    it('should add an event on /case/:caseId/events POST', function(done) {
     var insertedId = -1;
     model.saveEvent(eventObj_16, caseId_1).then((result) => {
     insertedId = parseInt(result);
     });
     var insertedEvent = JSON.parse(JSON.stringify(eventObj_16));
     insertedEvent.eventId = insertedId;
     model.getEventByEventId(insertedId).should.eventually.be.equal(insertedEvent).notify(done);
     });
    it('should update an event on /case/:caseId/events/:eventId PUT');
    it('should delete an event on /case/:caseId/events/:eventId DELETE');
});