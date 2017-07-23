/**
 * Created by FernandoA on 4/16/2017.
 */
"use strict";

const inviteRepo = require('../repository/inviteRepo');
const Validator = require('jsonschema').Validator;
const mailHelper = require('../models/helpers/mailHelper');
const smsHelper = require('../models/helpers/smsHelper');
const RequestValidationError = require('../errors/requestValidationError');
let AppError = require('../errors/appError');
const AppError2 = require('../errors/appError2');
const DbError = require('../errors/customErrors/dbError');
const SendGridError2 = require('../errors/customErrors/sendGridError');

let Promise = require('bluebird');

/*
DTOs definition
 */
var schemaInvitesPOST = {
    "id": "/Invite",
    "type": "object",
    "properties": {
        "by_email": {"type": "boolean"},
        "invite_link": {"type": "string"},
        "case_id": {"type": "number"},
        "inviter_user_id": {"type": "number"},
        "invitee_email": {"type": ["string", "null"]},
        "invitee_phone": {"type": ["string", "null"]},
        "relationship_id": {"type": "number"}
    },
    "required": ["by_email", "invite_link", "case_id" , "inviter_user_id", "relationship_id"]
};

let _this = null;

class InviteModel {
    constructor(){
        _this = this;
    }

    /**
     * Saves an invite based on an invite from the user.
     * @param req Request object
     * @returns {*}
     */
    saveInvite(invite) {
        //1) Validate request format
        var val = new Validator().validate(invite, schemaInvitesPOST);
        if (!val.valid) {
            throw new RequestValidationError(val.errors);
        }
        //2) Validate that email or phone is in the request.
        if (invite.by_email && !invite.invitee_email)
            throw new AppError("If the invite is by email the email is required");
        if (!invite.by_email && !invite.invitee_phone)
            throw new AppError("If the invite is by SMS the phone is required");

        //2) TODO Get user info from the inviter and case info
        var caseInfo = {
            name: "ACL tear",
            patientName: "Peter Yewell"
        };

        var inviterObj = {
            name: "Fernando",
            email: "abdala.fernando@gmail.com"
        };

        //3) Send invite by email or phone
        let p;
        if (invite.by_email) {
            let paramEmail = {
                from: inviterObj.email,
                to: invite.invitee_email,
                subject: "",
                templateId: "063c01df-4adc-4c62-b458-37303c7d3e34",
                params: [
                    {name: "%patientName%", value: caseInfo.patientName},
                    {name: "%caseName%", value: caseInfo.name},
                    {name: "%deepLink%", value: invite.invite_link}
                ]
            };
            p = mailHelper.sendEmailWithTemplate(paramEmail);
            //p = new Promise.resolve("ok");
        }
        else {
            var body = inviterObj.name + "invites to join " + caseInfo.patientName + "'s " +
                       caseInfo.name + " journey using Outpatient app. Download Outpatient" +
                        " to Match, Message, and Learn with " + inviterObj.name;

            p = smsHelper.sendSms(invite.invitee_phone, body);
        }

        return p.then((result) => {
                //4) TODO save invite row in the DB.
                return inviteRepo.insertInvite(invite)
                    .then((rows) => {
                        return rows.toString();
                    }).catch((err) => {
                        return Promise.reject(new DbError(err));
                    });
            }).catch((err) => {
                if (err instanceof DbError)
                    return Promise.reject(err);
                else
                    return Promise.reject(new AppError("There was an error sending the invite with email or SMS.", 11));
            });
    }

    saveInvite2(invite) {
        //1) Validate request format
        var val = new Validator().validate(invite, schemaInvitesPOST);
        if (!val.valid) {
            throw new RequestValidationError(val.errors);
        }
        //2) Validate that email or phone is in the request.
        if (invite.by_email && !invite.invitee_email)
            throw new AppError("If the invite is by email the email is required");
        if (!invite.by_email && !invite.invitee_phone)
            throw new AppError("If the invite is by SMS the phone is required");

        //2) TODO Get user info from the inviter and case info
        var caseInfo = {
            name: "ACL tear",
            patientName: "Peter Yewell"
        };

        var inviterObj = {
            name: "Fernando",
            email: "abdala.fernando@gmail.com"
        };

        //3) Send invite by email or phone
        let p;
        if (invite.by_email) {
            let paramEmail = {
                from: inviterObj.email,
                to: invite.invitee_email,
                subject: "",
                templateId: "2222", //063c01df-4adc-4c62-b458-37303c7d3e34
                params: [
                    {name: "%patientName%", value: caseInfo.patientName},
                    {name: "%caseName%", value: caseInfo.name},
                    {name: "%deepLink%", value: invite.invite_link}
                ]
            };
            p = mailHelper.sendEmailWithTemplate(paramEmail);
            //p = new Promise.resolve("ok");
        }
        else {
            var body = inviterObj.name + "invites to join " + caseInfo.patientName + "'s " +
                caseInfo.name + " journey using Outpatient app. Download Outpatient" +
                " to Match, Message, and Learn with " + inviterObj.name;

            p = smsHelper.sendSms(invite.invitee_phone, body);
        }

        return p
            .then((result) => {
                return inviteRepo.insertInvite(invite)
            })
            .then((rows) => {
                return rows.toString()
            }).catch(typeof(AppError), (err) => {
                return Promise.reject(err);
            }).catch((err) => {
                return Promise.reject(new DbError(err));
            });
                /*
                if (err && err.name && err.name == "SendGridError")
                    return Promise.reject(err);
                else
                    return Promise.reject(new DbError(err));
                    */

    }
}
module.exports = new InviteModel();
