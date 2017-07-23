/**
 * Created by FernandoA on 7/17/2017.
 */
'use strict';

//Error constructor
function AppError2(message) {
    this.message = message ? message : "";
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    else {
        this.stack = (new Error()).stack;
    }
}

//Extend prototype
AppError2.prototype = new Error();
AppError2.prototype.constructor = AppError2;
AppError2.prototype.name = 'AppError2';

//Export
module.exports = AppError2;