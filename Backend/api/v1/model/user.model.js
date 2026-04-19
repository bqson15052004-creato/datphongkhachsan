const mogoose = require('mongoose');

const userSchema = new mogoose.Schema({
    full_name: {
        type: String,   
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,       
        required: true,
    },
    phone: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    status: {
        type: String,
        default: "active",
    }

});

const user = mogoose.model('users', userSchema);

module.exports = user;