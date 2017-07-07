/**
 * Created by FernandoA on 4/16/2017.
 */
"use strict"

const calendarRepo = require('../repository/calendarRepo');

let _this = null;

class CalendarModel {
    constructor(){
        _this = this;
    }

    getEventTypes() {
        return calendarRepo.getEventTypes();
    }

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

    updateEvent(event, caseId, eventId) {
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
                return _this.mapEvent(result);
            });
    }

    getEventsByCaseId(param){
        return calendarRepo.getEventsByCaseOrEventId(true, param.caseId)
                .then(function (result) {
                    return _this.mapEvent(result);
                });
    }

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
                        reminder: dbEvent.io_reminder_id,
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
