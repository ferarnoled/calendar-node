/**
 * Created by FernandoA on 4/16/2017.
 */
"use strict";

let knex = require("../domain/index");
let moments= require('moment');
let Promise = require('bluebird');

let _this = null;
let _private = {};

class CalendarRepo {

    constructor() {
        _this = this;
    }

	getEventTypes() {
        return knex.withSchema("cal").select('*').from('event_types').timeout(1000);
		//query knex
        //return db.EventTypes.findAll();
    }

    getEventsByCaseOrEventId(byCaseId, paramId) {
        return knex('cal.events as e')
            //.withSchema("cal")
            .leftJoin('cal.transportations as t', 'e.transportation_id', 't.transportation_id')
            .leftJoin('locations as l', 'e.location_id', 'l.location_id')
            .leftJoin('cal.event_types as ee', 'e.event_type_id', 'ee.event_type_id')
            .where(byCaseId ? 'case_id' : 'event_id', paramId)
            .select('event_id', 'e.name as event_name', 'ee.name as event_type_name'
                    , 'l.location_id', 'l.name as location_name', 'l.address', 'l.phone', 'l.latitude', 'l.longitude'
                    , 'start_date', 'end_date', 'repeat_rule_id', 'repeat_ends', 'reminder_id'
                    , 't.name as transportation_name', 'notes');
    }

    queriesBeforeSaveEvent(event) {
        return Promise.all([_this.getLocationId(event.location)
                            , _this.getEventTypeId(event)
                            , _this.getTransportationId(event)]);
    }

    saveEvent(event, caseId) {
        _this.queriesBeforeSaveEvent(event)
                .then(item => {
                    //console.log("item:" + JSON.stringify(item[1][0], null, 4));
                    // 1) after doing the queries assign the values to complete the event object.
                    if (item && item.length >= 1 && !item[0])
                        event.location.location_id = item[0].location_id;
                    if (item[1])
                        event.event_type_id = item[1][0].event_type_id;
                    if (item[2])
                        event.transportation_id = item[2].transportation_id;
                    //2) Validations
                    if (event.event_type_id === undefined)
                        throw "The event type does not exist.";
                    if (event.transportation_id === undefined)
                        event.transportation_id = null;
                    //3) Open transaction
                    return knex.transaction(function (trx) {
                        let promise;
                        //4) Insert location row if the location doesn't exists
                        if (event.location.location_id === null || event.location.location_id === undefined) {
                            promise = knex('locations').transacting(trx)
                                .returning('location_id').insert({
                                address: event.location.address,
                                name: event.location.location_name,
                                latitude: event.location.latitude,
                                longitude: event.location.longitude,
                                phone: event.location.phone
                            }).then(function(resp) {
                                return resp[0];
                            });
                        }
                        else {
                            promise = Promise.resolve(event.location.location_id);
                        }
                        //5) Last step insert the event.
                        promise.then(function (locationId) {
                            //console.log("event insert:" + JSON.stringify(event, null, 4));
                            knex('cal.events').transacting(trx)
                                .returning('event_id').insert(
                                { name: event.event_name
                                    , case_id: caseId
                                    , event_type_id: event.event_type_id
                                    , start_date: event.start_date
                                    , end_date: event.end_date
                                    , all_day: event.all_day
                                    , location_id: locationId
                                    , notes: event.notes
                                    , transportation_id: event.transportaion_id
                                    , repeat_rule_id: event.repeat_rule
                                    , repeat_ends: event.repeate_ends
                                    , reminder_id: event.reminder
                                }
                            )
                                .then(function(resp) {
                                    var eventId = resp[0];
                                    return eventId;
                                })
                                .then(trx.commit)
                                .catch(trx.rollback);
                        })
                    });
                    /*
                    .then(function (resp) {
                        console.log('Transaction complete.');
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
                    */
        });
    }

    saveEventOld(event) {
        /*
        console.log(eventJson);
        var event = JSON.parse(JSON.stringify(eventJson));
        console.log(event);
        */

        //var event = {"eventName":"Event 2","eventTypeName":"Physical Therapy","location":{"locationName":"Peet' Coffe","address":"123 Main Street, Los Altos, CA 94022","phone":null,"latitude":"37.4738000","longitude":"-122.1916327"},"startDate":"2017-06-30T21:00:06.000Z","endDate":"2017-06-30T22:00:06.000Z","repeatRule":null,"repeatEnds":null,"reminder":null,"notes":"My notes"}]
        //console.log(event);

        //https://stackoverflow.com/questions/40745603/how-to-implement-transaction-in-knex
        //1) Check if location exists, if exists use the id
        //2) If location doesn't exists insert and get the id
        //3) Insert event

        knex.transaction(function(trx) {

            var event_type_id = knex('cal.event_types').where({
                name: event.event_type_name
            }).select('event_id');
            if (!event_type_id || event_type_id.length == 0 && !event_type_id)
                throw "The event type does not exist.";

            var transportaion_id = knex('cal.transportations').where({
                name: event.transportation_name
            }).select('transportation_id');
            if (!transportaion_id || transportaion_id.length == 0 && !transportaion_id)
                throw "The transporation does not exist.";

            //var location_id = null;
            console.log("event_type_id:" + event_type_id);

            let promise;
            if (location_id == null) {
                promise = knex('locations').transacting(trx).insert({
                        address: event.location.address,
                        name: event.location.location_name,
                        latitude: event.location.latitude,
                        longitude: event.location.longitude,
                        phone: event.location.phone
                    }).then(function(resp) {
                        return resp[0];
                    });
            }
            else
            {
                promise = Promise.resolve(location_id);
            }
            promise.then(function (locationId) {
                knex('cal.events').transacting(trx).insert(
                    { name: event.name
                    , case_id: event.case_id
                        , event_type_id: event_type_id
                        , start_date: event.start_date
                        , end_date: event.end_date
                        , all_day: event.all_day
                        , location_id: locationId
                        , notes: event.notes
                        , transportation_id: transportaion_id
                        , repeat_rule_id: event.repeat_rule_id
                        , repeat_ends: event.repeate_ends
                        , reminder_id: reminder
                    }
                )
                    .then(function(resp) {
                        var eventId = resp[0];
                        return someExternalMethod(id, trx);
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);
            })
        })
        .then(function(resp) {
            console.log('Transaction complete.');
        })
        .catch(function(err) {
            console.error(err);
        });
    }

    getLocationId(locationObj) {
        return knex('locations').where({
            name: locationObj.location_name,
            latitude: locationObj.latitude,
            longitude: locationObj.longitude
        }).select('location_id');
    }

    getEventTypeId(event) {
        return knex('cal.event_types').where({
            name: event.event_type_name
        }).select('event_type_id');
    }

    getTransportationId(event) {
        return knex('cal.transportations').where({
            name: event.transportation_name
        }).select('transportation_id');
    }
}

module.exports = new CalendarRepo();