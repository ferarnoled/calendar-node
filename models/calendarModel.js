/**
 * Created by FernandoA on 4/16/2017.
 */
"use strict";

const calendarRepo = require('../repository/calendarRepo');
//let check = require('validator').check();

let _this = null;

class CalendarModel {
    constructor(){
        _this = this;
    }

    getEventTypes() {
        return calendarRepo.getEventTypes();
    }

    /**
     * Saves a new event (calendar) to the DB.
     * @param {Event} event Event object to be saved
     * @param {number} caseId caseId coming from the URL querystring
     * @returns {Promise.<TResult>|*} TBD
     */
    saveEvent(event, caseId) {
        return calendarRepo.upsertEvent(event, caseId, true).then((rows) => {
            return new Promise((resolve, reject) => {
                try {
                    //Need to convert number to string because express doesn't accept an int as a response
                    resolve(rows.toString());
                }
                catch (ex) {
                    reject(ex);
                }
            });
        });
    }

    /**
     * Updates an event to the DB based on the eventId
     * @param {Object} event Event object to be updated
     * @param {number} caseId caseId of the event.
     * @param {number} eventId EventId used to do the update.
     * @returns {Promise.<TResult>|*} TBD
     */
    updateEvent(event, caseId, eventId) {
        /*
        try {
            check('test@email.com').len(6, 64).isEmail();       //Methods are chainable
            check(event.all_day, "allDay field should be boolean").isBoolean();                               //Throws 'Invalid integer'
            check(event.startDate, 'statDate field should be a Date').isInt();      //Throws 'Please enter a number'
            check('abcdefghijklmnopzrtsuvqxyz').is(/^[a-z]+$/);
        }
        catch (ex) {

        }
        */
        event.event_id = eventId;
        return calendarRepo.upsertEvent(event, caseId, false).then((rows) => {
            return new Promise((resolve, reject) => {
                try {
                    //Need to convert number to string because express doesn't accept an int as a response
                    resolve(rows.toString());
                }
                catch (ex) {
                    reject(ex);
                }
            });
        });
    }

    /**
     * Deletes and event based on the eventID
     * @param {number} eventId used to do the delete.
     * @returns {Promise.<TResult>|*}
     */
    deleteEvent(eventId) {
        return calendarRepo.deleteEvent(eventId).then((rows) => {
            return new Promise((resolve, reject) => {
                try {
                    resolve(rows.toString());
                }
                catch (ex) {
                    reject(ex);
                }
            });
        });
    }

    getEventByEventId(eventId){
        return calendarRepo.getEventsByCaseOrEventId(false, eventId)
            .then(function (result) {
                return _this.mapEvent(result, false);
            });
    }

    getEventsByCaseId(param){
        return calendarRepo.getEventsByCaseOrEventId(true, param.caseId)
                .then(function (result) {
                    return _this.mapEvent(result);
                });
    }

    /**
     * Based on event or events query to the DB it maps to DTOs
     * @param items If is a list array of event objects, if is for not one Event object
     * @param list Indicates if the calling functions requiers an array or not.
     * @returns {Promise} Promise to be resolved higher in the stack.
     */
    mapEvent(items, list = true) {
        return new Promise((resolve, reject) => {
            try {
                if (!items || items.length < 1 || !items[0]) return resolve(null);
                var dbEvent = items[0];
                var events = items.map((dbEvent) => {
                    var event = {
                        //Currently int. Might need to be converted to bigInt in the future (be careful: javascript can't
                        // handle bigint natively)
                        eventId: dbEvent.event_id,
                        eventName: dbEvent.event_name,
                        eventTypeName: dbEvent.event_type_name,
                        location: {
                            locationName: dbEvent.location_name,
                            address: dbEvent.address,
                            phone: dbEvent.phone,
                            latitude: dbEvent.latitude,
                            longitude: dbEvent.longitude
                        },
                        allDay: dbEvent.all_day,
                        startDate: dbEvent.start_date,
                        endDate: dbEvent.end_date,
                        repeat: {
                            frequency: dbEvent.ios_repeat_frequency_id,
                            interval: dbEvent.ios_repeat_interval_id,
                            endDate: dbEvent.ios_repeat_end_date
                        },
                        reminder: dbEvent.ios_reminder_id,
                        transportation: dbEvent.tranportation_name !== undefined ? dbEvent.tranportation_name : null,
                        notes: dbEvent.notes
                    };
                    return event;
                });
                return list ? resolve(events) : resolve(events[0]);
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
}
module.exports = new CalendarModel();
