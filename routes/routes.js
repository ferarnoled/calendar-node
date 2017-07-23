/**
 * Created by FernandoA on 4/15/2017.
 */
"use strict";

const routes = require('express').Router();
const calendarModel = require('../models/calendarModel');
const inviteModel = require('../models/inviteModel');

const mailHelper = require('../models/helpers/mailHelper');
const smsHelper = require('../models/helpers/smsHelper');
const AppError = require('../errors/appError');
const ReqError = require('../errors/requestValidationError');

//const resolve = require('path').resolve;

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

//Test
routes.get('/tests/js', (req, res, next) => {
    console.log("AppError class instanceof Error: " + (AppError instanceof Error).toString());
    console.log("ReqError class instanceof AppError: " + (ReqError instanceof AppError).toString());
    console.log("ReqError class instanceof Error: " + (ReqError instanceof Error).toString());

    var o1 = new AppError();
    var o2 = new ReqError();
    console.log("AppError object instanceof Error: " + (o1 instanceof Error).toString());
    console.log("ReqError object instanceof AppError: " + (o2 instanceof AppError).toString());
    console.log("ReqError object instanceof Error: " +(o2 instanceof Error).toString());

    res.send("hello");
});
routes.get('/tests/testsms', (req, res, next) => {

    let result = smsHelper.sendSms("+14084315005", "test sms");
    res.send(result);
    /*
    smsHelper.sendSms("+14084315005", "test sms").then(
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

routes.get('/tests/testemail', (req, res, next) => {
    var e = {
        from: "abdala.fernando@gmail.com",
        to: "abdala.fernando@gmail.com",
        subject: "hello there",
        content: "Hello there, body bla bha blah"
    };

    mailHelper.sendEmailNoTemplate(e.from, e.to, e.subject, e.content).then(
        function(result) {
            res.send(result);
        },
        function(error) {
            next(error);
        }
    ).catch((err) => {
        next(err);
    });
});

routes.get('/tests/testemailtemplate', (req, res, next) => {
    var e = {
        from: "abdala.fernando@gmail.com",
        to: "abdala.fernando@gmail.com",
        subject: "hello there",
        templateId: "063c01df-4adc-4c62-b458-37303c7d3e34",
        params: [
            {name: "%patientName%", value: "Peter Yewell"},
            {name: "%caseName%", value: "ACL tear"},
            {name: "%deepLink%", value: "https://p8t8.test-app.link/PrQqAA8NME"}
        ]
    };

    mailHelper.sendEmailWithTemplate(e).then(
        function(result) {
            res.send(result);
        },
        function(error) {
            next(error);
        }
    ).catch((err) => {
        next(err);
    });
});

// CALENDAR
routes.get('/cases/:caseId/events/:eventId', (req,res,next) => {
    return resolveReturnPromise(
        calendarModel.getEventByEventId(req.params.eventId)
        , req,res,next);
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

//INVITES
routes.post('/invites', (req, res, next) => {
    return resolveReturnPromise(
        inviteModel.saveInvite2(req.body)
        , req,res,next);
});

function genericResponse(isError, result) {
    if (result && result.success != undefined && result.error != undefined && result.error != undefined)
        return result;
    var ret = {
        success: !isError,
        //status: !isError ? 200 : (result.status || 500),
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
    ).catch((err) => {
        next(genericResponse(true, err));
    });
}

module.exports = routes;