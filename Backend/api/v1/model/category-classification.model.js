const mongoose = require('mongoose');


const categoryClassificationSchema = new mongoose.Schema({
    name_category_classification: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
});


const categoryClassification = mongoose.model('category-classification', categoryClassificationSchema);

module.exports = categoryClassification;
