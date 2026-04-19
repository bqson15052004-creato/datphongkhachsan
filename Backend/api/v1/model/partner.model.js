const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name_bussiness: {
        type: String,
    },
    id_tax: {
        type: String,
    },
    address_bussiness: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    status: {
        type: String,
        default: "active",
    }
});


const Partner = mongoose.model("partners", partnerSchema);

module.exports = Partner;