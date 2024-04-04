const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userData = new Schema({
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    profilepic:{
        type : String
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    pass: {
        type: String,
        require: true
    },
    confirmpass: {
        type: String,
        require: true
    },
    about:{ 
        type : String,
        require: true
    },
    company: {
        type: String,
        require: true
    },
    job: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    phone: {
        type: Number
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    },
    linkedin: {
        type: String
    },
    currentpass: {
        type: String,
        require: true
    },
    otp:{
        type : String
    }
});

module.exports = mongoose.model('user', userData)

