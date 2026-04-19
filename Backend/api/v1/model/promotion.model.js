const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount_percent: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'expired'],
        default: 'available'
    },
    note: {
        type: String
    },
    id_partner: {
        type: String,
        required: true
    }
});