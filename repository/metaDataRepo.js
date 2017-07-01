/**
 * Created by FernandoA on 4/16/2017.
 */
"use strict";

let db = require("../domain/index");
let moments= require('moment');
let Promise = require('bluebird');

let _this = null;
let _private = {};

class MetaDataRepo {

    constructor() {
        _this = this;
    }

    getCities() {
        return db.Cities.findAll();
    }

    getCountries() {
        return db.Countries.findAll();
    }
}

module.exports = new MetaDataRepo();