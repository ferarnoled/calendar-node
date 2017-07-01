/**
 * Created by FernandoA on 12/1/2016.
 */
var rulesengine = require('../models/carpartrulesengine/carPartRulesEngine');
//var pjson = require('../../../package.json');

var testGet = true;
var saleId = 70179;

if (testGet) {
    //rulesengine.defineRules();

    let facts = {
        oilLevel: 60
    }

    rulesengine.runEngineRules(facts);
}