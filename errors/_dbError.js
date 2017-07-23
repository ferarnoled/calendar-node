/**
 * Created by FernandoA on 7/17/2017.
 */
module.exports = class extends require('./appError') {
    /*
    constructor (fields) {
        // Overriding both message and error code.
        super('DB error', 3);
        // Saving custom property.
        this.data = fields || {};
        // Set status to 500, since this is not expected
        this.status = 500;
    }
    */
    constructor(error){
        super('There was an unxpected error in DB', 3);
        if (!error) throw new Error('DBError requires an error');
        this.original = error;
        this.new_stack = this.stack;
        let message_lines =  (this.message.match(/\n/g)||[]).length + 1;
        this.stack = this.stack.split('\n').slice(0, message_lines+1).join('\n') + '\n' +
            error.stack;
    }
};