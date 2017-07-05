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

    queriesBeforeUpsertEvent(event) {
        return Promise.all([_this.getLocationId(event.location)
                            , _this.getEventTypeId(event)
                            , _this.getTransportationId(event)]);
    }

    upsertEvent(event, caseId, isInsert = true) {
        return _this.queriesBeforeUpsertEvent(event)
                .then(item => {
                    console.log("item:" + JSON.stringify(item, null, 4));
                    // 1) after doing the queries assign the values to complete the event object.
                    if (item && item.length >= 1 && item[0] && item[0].length > 0)
                        event.location.location_id = item[0][0].location_id;
                    if (item.length >= 2 && item[1] && item[1].length > 0)
                        event.event_type_id = item[1][0].event_type_id;
                    if (item.length >= 3 && item[2] && item[2].length > 0)
                        event.transportation_id = item[2] ? item[2].transportation_id : null;
                    //2) Validations
                    if (event.event_type_id === undefined)
                        throw "The event type does not exist.";
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
                                            , location_id: locationId
                                            , notes: event.notes
                                            , transportation_id: event.transportaion_id
                                            , repeat_rule_id: event.repeat_rule
                                            , repeat_ends: event.repeate_ends
                                            , reminder_id: event.reminder
                                        }
                                    )
                                    .then(function() {
                                        return event.event_id;
                                    })
                                    .then(trx.commit)
                                    .catch(trx.rollback);
                            }
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
            name: event.transportation_name
        }).select('transportation_id');
    }
}

module.exports = new CalendarRepo();