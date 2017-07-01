/**
 * Created by FernandoA on 4/16/2017.
 */
"use strict"

const metadatarepo = require('../repository/metaDataRepo');

let _this = null;

class MetaData {
    constructor(){
        _this = this;
    }

    getCities(){
        return metadatarepo.getCities();
    }

    getCountries(){
        return metadatarepo.getCities();
    }
}
module.exports = new MetaData();
