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
    }

    /**
     * Select query that returns all event columns needed to create the event object.
     * Might return one or more events
     * @param {boolean} byCaseId if the query is based on caseId (many) or eventId (one)
     * @param {number} paramId numberic identifier, either caseId or eventId
     * @returns {*|void|{get, set}} knex promise with the recorset.
     */
    getEventsByCaseOrEventId(byCaseId, paramId) {
        return knex('cal.events as e')
            //.withSchema("cal")
            .leftJoin('cal.transportations as t', 'e.transportation_id', 't.transportation_id')
            .leftJoin('locations as l', 'e.location_id', 'l.location_id')
            .leftJoin('cal.event_types as ee', 'e.event_type_id', 'ee.event_type_id')
            .where(byCaseId ? 'case_id' : 'event_id', paramId)
            .select('event_id', 'e.name as event_name', 'ee.name as event_type_name'
                    , 'l.location_id', 'l.name as location_name', 'l.address', 'l.phone', 'l.latitude', 'l.longitude'
                    , 'start_date', 'end_date', 'e.ios_repeat_interval_id', 'e.ios_repeat_end_date', 'e.ios_repeat_frequency_id'
                    , 'e.ios_reminder_id', 't.name as transportation_name', 'notes', 'all_day');
    }

    /**
     * Queries used to verify current data before doing the upsert
     * @param event
     * @returns {Promise.<*>}
     */
    queriesBeforeUpsertEvent(event) {
        return Promise.all([_this.getLocationId(event.location)
                            , _this.getEventTypeId(event)
                            , _this.getTransportationId(event)]);
    }

    /**
     * Upsert method for the event:
     * 1) Perform queries to know the current status of the object in the DB.
     * 2) Do inserts of objects that depend on the event. This is for event_types and locations tables.
     * 3) Do the insert or update based on who called the function.
     * 4) Commit if ok, rollback if error. Return promise.
     * @param event
     * @param caseId
     * @param isInsert
     * @returns {Promise.<TResult>}
     */
    upsertEvent(event, caseId, isInsert = true) {
        return _this.queriesBeforeUpsertEvent(event)
                .then(item => {
                    // 1) after doing the queries assign the values to complete the event object.
                    //console.log("item:" + JSON.stringify(item, null, 4));
                    if (item && item.length >= 1 && item[0] && item[0].length > 0)
                        event.location.location_id = item[0][0].location_id;
                    if (item.length >= 2 && item[1] && item[1].length > 0)
                        event.event_type_id = item[1][0].event_type_id;
                    if (item.length >= 3 && item[2] && item[2].length > 0)
                        event.transportation_id = item[2] ? item[2].transportation_id : null;
                    console.log("upsertEvent: queries done.");
                    //2) Validations
                    /*
                    if (event.event_type_id === undefined)
                        throw "The event type does not exist.";
                    */
                    //3) Open transaction
                    return knex.transaction(function (trx) {
                        //4) Insert event_type if not exists, insert location if not exists
                        Promise.all([_this.insertEventTypeIfNew(event, trx)
                            , _this.insertLocationIfNew(event, trx)]).then(result => {
                                //console.log("result:" + JSON.stringify(result, null, 4));
                                event.event_type_id = result[0];
                                event.location.location_id = result[1];

                            //5) Last step insert the event.
                            if (isInsert) {
                                knex('cal.events').transacting(trx)
                                    .returning('event_id').insert(
                                    {
                                        name: event.event_name
                                        , case_id: caseId
                                        , event_type_id: event.event_type_id
                                        , start_date: event.start_date
                                        , end_date: event.end_date
                                        , all_day: event.all_day
                                        , location_id: event.location.location_id
                                        , notes: event.notes
                                        , transportation_id: event.transportaion_id
                                        , ios_repeat_interval_id: event.repeat.interval
                                        , ios_repeat_frequency_id: event.repeat.frequency
                                        , ios_repeat_end_date: event.repeat.end_date
                                        , ios_reminder_id: event.reminder
                                    }
                                )
                                    .then(function(resp) {
                                        return resp[0];
                                    })
                                    .then(trx.commit)
                                    .catch(trx.rollback);
                            }
                            else {
                                knex('cal.events').transacting(trx)
                                    .where({event_id: event.event_id,
                                        case_id: caseId})
                                    .update(
                                        {
                                            name: event.event_name
                                            , event_type_id: event.event_type_id
                                            , start_date: event.start_date
                                            , end_date: event.end_date
                                            , all_day: event.all_day
                                            , location_id: event.location.location_id
                                            , notes: event.notes
                                            , transportation_id: event.transportaion_id
                                            , ios_repeat_interval_id: event.repeat.interval
                                            , ios_repeat_frequency_id: event.repeat.frequency
                                            , ios_repeat_end_date: event.repeat.end_date
                                            , ios_reminder_id: event.reminder
                                        }
                                    )
                                    .then(function() {
                                        return event.event_id;
                                    })
                                    .then(trx.commit)
                                    .catch(trx.rollback);
                            }
                        });
                    });
                    /*
                    .then(function (resp) {
                        console.log('Transaction complete.');
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
                    */
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    deleteEvent(eventId) {
        return knex('cal.events').where('event_id', eventId).del();
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
            name: event.transportation
        }).select('transportation_id');
    }

    /**
     * Inserts an eventType to the DB if the event_type is new, otherwise it doesn't do anything
     * and returns the promise. Insert is depends on next steps (see trx).
     * @param event event object
     * @param trx transaction opened in upsertEvent. Will commit in another step
     * @returns {*} promise with the event_type_id
     */
    insertEventTypeIfNew(event, trx) {
        let promise;
        if (event.event_type_id === null || event.event_type_id === undefined) {
            promise = knex('cal.event_types').transacting(trx)
                .returning('event_type_id').insert({
                    name: event.event_type_name,
                    is_active: '1'
                }).then(function(resp) {
                    return resp[0];
                }).catch((err) => {
                    reject(err);
                });
        }
        else {
            //console.log("insertEventTypeIfNew:" + event.event_type_id);
            promise = Promise.resolve(event.event_type_id);
        }
        return promise;
    }

    /**
     * Inserts a location to the DB if the location is new, otherwise it doesn't do anything
     * and returns the promise. Insert depends on next steps from calling function.
     * @param event event object
     * @param trx transaction opened in upsertEvent. Will commit in another step
     * @returns {*} promise with the location_id
     */
    insertLocationIfNew(event, trx) {
        let promise;
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
                }).catch((err) => {
                    reject(err);
                });
        }
        else {
            promise = Promise.resolve(event.location.location_id);
        }
        return promise;
    }
}

module.exports = new CalendarRepo();