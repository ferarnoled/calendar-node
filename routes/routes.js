/**
 * Created by FernandoA on 4/15/2017.
 */
"use strict";
const routes = require('express').Router();
const calendarModel = require('../models/calendarModel');
const resolve = require('path').resolve;

routes.get('/eventtypes', (req,res,next) => {
    calendarModel.getEventTypes(req.query).then(
        function(result){
            res.send(result);
        },
        function(error){
            next(error);
        }
    );
});


/*
routes.get('/locations', (req,res,next) => {
    calendarModel.getLocations(req.query).then(
        function(result){
            res.send(result);
        },
        function(error){
            next(error);
        }
    );
});
*/

// CALENDAR
routes.get('/cases/:caseId/events/:eventId', (req,res,next) => {
    calendarModel.getEventsByCaseId(req.params.eventId).then(
        function(result){
            res.send(result);
        },
        function(error){
            next(error);
        }
    );
});

routes.get('/cases/:caseId/events', (req,res,next) => {
    console.log(req.params);
    calendarModel.getEventsByCaseId(req.params).then(
        function(result){
            res.send(result);
        },
        function(error){
            next(error);
        }
    );
});

routes.post('/cases/:caseId/events', (req, res, next) => {
    calendarModel.saveEvent(req.body, req.params.caseId).then(
        function(result) {
            res.send(result);
        },
        function(error) {
            next(error);
        }
    );
});

routes.put('/cases/:caseId/events/:eventId', (req, res, next) => {
    calendarModel.updateEvent(req.body, req.params.caseId, req.params.eventId).then(
        function(result) {
            res.send(result);
        },
        function(error) {
            next(error);
        }
    );
});

routes.delete('/cases/:caseId/events/:eventId', (req, res, next) => {
    calendarModel.deleteEvent(req.params.eventId).then(
        function(result) {
            res.send(result);
        },
        function(error) {
            next(error);
        }
    );
});

//chat
routes.get('/chat', (req, res, next) => {
    //console.log();
    res.sendFile(resolve('views/index.html'));
})

routes.get('/chat/sendbird', (req, res, next) => {
    //console.log();
    res.sendFile(resolve('views/sendbird/index.html'));
})

module.exports = routes;