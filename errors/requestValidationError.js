/**
 * Created by FernandoA on 7/17/2017.
 */
module.exports = class extends require('./appError') {
    constructor (fields) {
        // Overriding both message and error code.
        super('Request validation failed', 2);

        // Saving custom property.
        this.data = fields || {};
    }
};