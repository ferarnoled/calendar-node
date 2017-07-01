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

    getEventsByCaseId(param){
        return calendarRepo.getEventsByCaseId(param.caseId)
                .then(function (result) {
                    return _this.mapEvent(result);
                });
    }

    mapEvent(items) {
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
                            longitude: dbEvent.longitude,
                            startDate: dbEvent.start_date,
                            endDate: dbEvent.end_date,
                            repeatRule: dbEvent.repeat_rule_id,
                            repeatEnds: dbEvent.repeat_ends,
                            reminder: dbEvent.reminder_id
                        },
                        transportation: dbEvent.tranportation_name,
                        notes: dbEvent.notes
                    };
                    return event;
                });
                resolve(events);
            }
            catch (ex) {
                reject(ex);
            }
        });
        return dbEvent;
    }
}
module.exports = new CalendarModel();
