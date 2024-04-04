const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectsData = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    category : {
        type: Schema.Types.ObjectId,
        ref : 'category'
    },
    projectName: {
        type: String,
        require: true
    },
    technology: [{
        type: String,
        require: true
    }],
    tags: [{
        type: String
    }],
    projectLink: {
        type: String,
        require: true
    },
    projectZip: [{
        type: String,
        require: true
    }],
    screenshorts: [{
        type: String,
        require: true
    }],
    download : {
        type : Number,
        default : 0
    },
    status: {
        type: String,
        enum : ['Pendding','Rejected','Approved'],
        default: 'Pendding',
        required : true
    },
});

module.exports = mongoose.model('project', projectsData)