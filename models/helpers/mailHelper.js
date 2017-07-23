/**
 * Created by FernandoA on 7/14/2017.
 */
"use strict"

const Promise = require('bluebird');

const helper = require('sendgrid').mail;
const config = require('../../config/config.json')[process.env.NODE_ENV || 'dev'];
//const CustomSendGridError = require('../../errors/customErrors/sendGridError');
const AppError = require('../../errors/appError');
const AppError2 = require('../../errors/appError2');

let _this = null;

class MailHelper {
    constructor() {
        _this = this;
    }

    sendEmailNoTemplate(from, to, subject, content) {
        var mFrom = new helper.Email(from);
        var mTo = new helper.Email(to);
        var mSubject = subject;
        var mContent = new helper.Content('text/plain', content);
        var mail = new helper.Mail(mFrom, mSubject, mTo, mContent);

        var sg = require('sendgrid')(config.sendGridApiKey);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });
        /*
        sg.API(request, function (error, response) {
            if (error) {
                console.log('Error response received');
            }
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        });
        */
        // With promise
        /*
        return sg.API(request)
            .then(function (response) {
                console.log(response.statusCode);
                console.log(response.body);
                console.log(response.headers);
            })
            .catch(function (error) {
                // error is an instance of SendGridError
                // The full response is attached to error.response
                console.log(error.response.statusCode);
            });
            */
        return sg.API(request);
    }

    sendEmailWithTemplate(mailData) {
        helper.Promise = Promise;
        let mail = new helper.Mail();

        mail.setSubject(mailData.subject);
        mail.setTemplateId(mailData.templateId); //mailData.templateId
        mail.setFrom(new helper.Email(mailData.from));

        var personalization = new helper.Personalization();
        personalization.addTo(new helper.Email(mailData.to));
        if (mailData.params && mailData.params.length > 0) {

            mailData.params.map((e) => {
                var substitution = new helper.Substitution(e.name, e.value);
                personalization.addSubstitution(substitution);
            });
        }
        mail.addPersonalization(personalization);

        var sg = require('sendgrid')(config.sendGridApiKey);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        //return Promise.reject(new AppError("hello"));
        try {
            return sg.API(request).then((ret) => {
                console.log('Email Sent');
            }).catch((err) => {
                var errorObj = new AppError(err.message);
                return Promise.reject(errorObj);
            });
        }
        catch (er) {
            var hello = 1;
        }
    }
}

module.exports = new MailHelper();