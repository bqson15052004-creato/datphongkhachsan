const mongoose = require('mongoose');

const systemDirectorySchema = new mongoose.Schema({
    name_system_directory: {
        type: String,
        required: true,
        trim: true,
    },
    id_category_classification: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        default: 'active',
    }

});


const systemDirectory = mongoose.model('system-directory', systemDirectorySchema);
module.exports = systemDirectory;