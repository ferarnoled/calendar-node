/**
 * Created by FernandoA on 6/30/2017.
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../www/appLite');
var should = chai.should();

chai.use(chaiHttp);

// var calendarModel = require('../models/calendarModel');
// var pjson = require('../../../package.json');

describe('calendar', function() {
    it('should list all events for :caseId on /case/:caseId/events GET', function(done) {
        var caseId = 1, eventId = 16;

        chai.request(server)
            .get('/cases/' + caseId + '/events/' + eventId)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it('should return a SINGLE event on /case/:caseId/events/:eventId GET');
    it('should add an event on /case/:caseId/events POST');
    it('should update an event on /case/:caseId/events/:eventId PUT');
    it('should delete an event on /case/:caseId/events/:eventId DELETE');
});