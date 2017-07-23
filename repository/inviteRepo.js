/**
 * Created by FernandoA on 4/16/2017.
 */
"use strict";

let knex = require("../domain/index");
let moments = require('moment');
let Promise = require('bluebird');

let _this = null;
let _private = {};

class InviteRepo {

    constructor() {
        _this = this;
    }

    /**
     * Inserts a invite to the DB when a user invites another user to the app.
     * @param invite invite object
     * @returns {*} promise with the invite_id
     */
    insertInvite(invite) {
        return knex('invites').returning('invite_id').insert(
            {
                invite_link: invite.invite_link
                , case_id: invite.case_id
                , inviter_user_id: invite.inviter_user_id
                , is_pending: true
                , invitee_email: invite.invitee_email
                , invitee_phone: invite.invitee_phone
                , relationship_id: invite.relationship_id
                , created_user: invite.inviter_user_id
                , created_timestamp: new Date()
            })
            .then(result =>{
                return result;
            }).catch(err => {
                 return Promise.reject(err);
            });
    }

}

module.exports = new InviteRepo();