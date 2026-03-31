const mogoose = require('mongoose');

const accountSchema = new mogoose.Schema({
    username: {
        type: String,   
        required: true,
        unique: true
    },
    password: {
        type: String,       
        required: true,
    },
    role: {
        type: String,   
        required: true,
    }
});

const account = mogoose.model('accounts', accountSchema);

module.exports = account;