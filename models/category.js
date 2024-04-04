const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoryData = new Schema({
    category: {
        type: String,
        require: true
    },
    image : String,
    description : String
});

module.exports = mongoose.model('category', categoryData)

