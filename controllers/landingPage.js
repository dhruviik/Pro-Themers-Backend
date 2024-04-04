const PROJECT = require('../models/projects')




exports.CategoryFind = async function (req, res, next) {
    try {
        let dataFind = await PROJECT.find({ category: req.params.id })
        res.status(201).json({
            status: "Success",
            message: "Category Found Successfully",
            data: dataFind
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.ProjectFind = async function (req, res, next) {
    try {
        let dataFind = await PROJECT.find({ _id: req.params.id })
        res.status(201).json({
            status: "Success",
            message: "Project Found Successfully",
            data: dataFind
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.ProjectDownloadsUpdate = async function (req, res, next) {
    try {
        let dataUpdate = await PROJECT.findByIdAndUpdate(req.params.id , {$inc : {download : 1}}, {new : true})
        res.status(201).json({
            status: "Success",
            message: "Project Found Successfully",
            data: dataUpdate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}