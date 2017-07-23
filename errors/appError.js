/**
 * Created by FernandoA on 7/17/2017.
 */
module.exports = class AppError extends Error {
    constructor (message, errorCode, status) {

        // Calling parent constructor of base Error class.
        super(message);

        // Capturing stack trace, excluding constructor call from it.
        if (typeof Error.captureStackTrace === 'function'){
            Error.captureStackTrace(this, this.constructor)
        } else {
            this.stack = (new Error(message)).stack
        }

        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;

        this.errorMessage = message;

        // Custom errorCode that might be useful for the client to use
        // If not specified we just assign 1;
        this.errorCode = errorCode || 1;

        // `422` is the default value. In case we don't use this class
        // the middleware should return 500 because it will be an unexpected error.
        this.status = status || 422;
    }
};