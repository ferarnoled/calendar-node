/** * Created by FernandoA on 7/21/2017. *///const AppError = require("../appError");module.exports = class SendGridErrorCustom extends Error {  /*   constructor (fields) {    // Overriding both message and error code.     super('DB error', 3);     // Saving custom property.     this.data = fields || {};     // Set status to 500, since this is not expected     this.status = 500;   }   */  constructor(error) {    super('There was an error sending an email with SendGrid');//, 11);    if (!error) throw new Error('error object required');    this.original = error;    this.new_stack = this.stack;    let message_lines = (this.message.match(/\n/g) || []).length + 1;    this.stack = this.stack.split('\n').slice(0, message_lines + 1).join('\n') + '\n' +        error.stack;  }};