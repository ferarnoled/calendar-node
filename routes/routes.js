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
    return resolveReturnPromise(
        calendarModel.getEventByEventId(req.params.eventId)
        , req,res,next);
    /*
    calendarModel.getEventByEventId(req.params.eventId).then(
        function(result){
            res.send(genericResponse(false, result));
        },
        function(error){
            next(genericResponse(true, error));
        }
    );
    */
});

routes.get('/cases/:caseId/events', (req,res,next) => {
    return resolveReturnPromise(
        calendarModel.getEventsByCaseId(req.params)
        , req,res,next);
});

routes.post('/cases/:caseId/events', (req, res, next) => {
    return resolveReturnPromise(
        calendarModel.saveEvent(req.body, req.params.caseId)
        , req,res,next);
    /*
    calendarModel.saveEvent(req.body, req.params.caseId).then(
        function(result) {
            res.send(result);
        },
        function(error) {
            next(error);
        }
    ).catch((err) => {
        next(err);
    });
    */
});

routes.put('/cases/:caseId/events/:eventId', (req, res, next) => {
    return resolveReturnPromise(
        calendarModel.updateEvent(req.body, req.params.caseId, req.params.eventId)
        , req,res,next);
});

routes.delete('/cases/:caseId/events/:eventId', (req, res, next) => {
    return resolveReturnPromise(
        calendarModel.deleteEvent(req.params.eventId)
        , req,res,next);
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

function genericResponse(isError, result) {
    if (result && result.success != undefined && result.error != undefined && result.error != undefined)
        return result;
    var ret = {
        success: !isError,
        status: !isError ? 200 : 422,
        error: isError ? result: null,
        data: !isError ? result: null
    }
    return ret;
}

function resolveReturnPromise(func, req,res,next) {
    func.then(
        function(result){
            res.send(genericResponse(false, result));
        },
        function(error){
            next(genericResponse(true, error));
        }
    );
}

module.exports = routes;