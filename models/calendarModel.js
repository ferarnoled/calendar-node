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
        return calendarRepo.saveEvent(event, caseId);
    }

    getEventByEventId(eventId){
        return calendarRepo.getEventByEventId(false, eventId)
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
                        repeatRule: dbEvent.repeat_rule_id,
                        repeatEnds: dbEvent.repeat_ends,
                        reminder: dbEvent.reminder_id,
                        transportation: dbEvent.tranportation_name !== undefined ? dbEvent.tranportation_name : null,
                        notes: dbEvent.notes
                    };
                    return event;
                });
                if (list)
                    resolve(events);
                else
                    resolve(events[0]);
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
}
module.exports = new CalendarModel();
