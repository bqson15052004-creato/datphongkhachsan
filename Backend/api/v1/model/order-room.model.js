const mongoose = require('mongoose');

const orderRoomSchema = new mongoose.Schema({
    id_user: {
        type: String,
        required: true
    },
    id_hotel: {
        type: String,
        required: true
    },
    id_room: {
        type: String,
        required: true
    },
    check_in_date: {
        type: Date,
        required: true
    },
    check_out_date: {
        type: Date,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    id_promation: {
        type: String,
    },
    note: {
        type: String,
    }


});

const OrderRoom = mongoose.model('order-room', orderRoomSchema);
module.exports = OrderRoom;