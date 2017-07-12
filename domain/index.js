"use strict"
//var fs = require("fs");
var path = require("path");
//var Sequelize = require("sequelize");

var dbconfig = require('../config/config.json')[process.env.NODE_ENV || 'dev'];
/*
pg.types.setTypeParser(1114, function(stringValue) {
  console.log(stringValue);
  return new Date(Date.parse(stringValue + "+0000"));
})
*/
var knex = require('knex')({
  client: 'pg',
  debug: dbconfig.debug == 1 ? 'true' : 'false',
  connection: {
    host : dbconfig.host,
    user : dbconfig.username,
    password : dbconfig.password,
    database : dbconfig.database
  },
  useNullAsDefault : false
});

module.exports = knex;

/*
var db = {};
var files = [];

getfiles(__dirname);

files
    .forEach(function (file) {
        var model = sequelize.import(file);
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

function getfiles(dir) {
    fs
        .readdirSync(path.join(dir))
        .filter(function (file) {
            if ((file.indexOf(".") !== 0) && (file !== "index.js") && (file.indexOf(".map") === -1) && (file.indexOf(".ts") === -1)) {
                if (fs.lstatSync(path.join(dir, file)).isDirectory()) {
                    getfiles(path.join(dir, file));
                }
                else {
                    files.push(path.join(dir, file));
                }
            }
        });
}
db.sequelize = sequelize;
db.Sequelize = Sequelize;
*/
