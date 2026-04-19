const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    hotel_name: {
        type: String,
        required: true
    },
    hotel_address: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    id_system_directory: {
        type: String,
        required: true
    },
    quantity_room: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
    },
    status: {
        type: String,
        default: 'active',
    },
    percent_permission: {
        type: Number,
        default: 0,
    }

});

const Hotel = mongoose.model('hotels', hotelSchema);
module.exports = Hotel;