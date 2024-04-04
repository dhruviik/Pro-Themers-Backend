const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminData = new Schema({
    email: {
        type: String,
        unique: true,
        require: true
    },
    pass: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('admin', adminData)

