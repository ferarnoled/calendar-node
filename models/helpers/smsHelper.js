/**
 * Created by FernandoA on 7/14/2017.
 */
"use strict"

const twilio = require('twilio');
const config = require('../../config/config.json')[process.env.NODE_ENV || 'dev'];
const RethrowError = require('../../errors/rethrowError');

let _this = null;

class SmsHelper {
    constructor() {
        _this = this;
    }

    sendSms(to, body) {

        var accountSid = "2222";//config.twilioAccountSid
        var authToken = config.twilioAuthToken;

        try {
            var client = new twilio(accountSid, authToken);

            return client.messages.create({
                body: body,
                to: to,  // Text this number
                from: config.twilioDefaultFromNumber
            });
        }
        catch (err) {
            throw new RethrowError(err);
        }
        /*
        .then((message) =>
            console.log(message.sid)
        ).catch((err) =>
            console.log(err)
            );
        */
    }
}

module.exports = new SmsHelper();