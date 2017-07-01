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
	
    getLocations() {
        return db.Locations.findAll();
    }

    getEventsByCaseId(caseId) {
        return knex('cal.events as e')
            //.withSchema("cal")
            .leftJoin('cal.transportations as t', 'e.transportation_id', 't.transportation_id')
            .leftJoin('locations as l', 'e.location_id', 'l.location_id')
            .leftJoin('cal.event_types as ee', 'e.event_type_id', 'ee.event_type_id')
            .where('case_id', caseId)
            .select('event_id', 'e.name as event_name', 'ee.name as event_type_name'
                    , 'l.location_id', 'l.name as location_name', 'l.address', 'l.phone', 'l.latitude', 'l.longitude'
                    , 'start_date', 'end_date', 'repeat_rule_id', 'repeat_ends', 'reminder_id'
                    , 't.name as transportation_name', 'notes');
    }
}

module.exports = new CalendarRepo();