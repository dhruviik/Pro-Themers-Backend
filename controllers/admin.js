const ADMIN = require('../models/admin')
const CATEGORY = require('../models/category')
const PROJECT = require('../models/projects')
const USER = require('../models/users')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, 
    secure: true,
    auth: {
        user: "patelbhargav44397@gmail.com",
        pass: "uwmvqcuuuyrwpaex",
    },
});

async function main(data,category,user) {
    const info = await transporter.sendMail({
        from: 'patelbhargav44397@gmail.com', 
        to: user.email,
        subject: "Project Update Record", 
        text: "", 
        html: `
            <b>Dear ${user.fname.charAt(0).toUpperCase()+user.fname.substring(1) + ' ' + user.lname.charAt(0).toUpperCase()+user.lname.substring(1)} <b> ,
                    <p style="margin-left : 60px;font-family:Garamond;font-size : 15px;color : black"> I would like to update you on the current status of your project. Your project name is <strong>${data.projectName}</strong>. Your project status is <strong>${data.status}</strong>. Additional information regarding project has been Mentioned Below.</p>
                    <p style="margin-left : 12px;font-family:Garamond;font-size:15px;color : black">Project information:</p>
        <table border="1" width="60%" cellpadding="5px" cellspacing="0px" align="center" color : black">
        <tr>
            <th>NO.</th>
            <th colspan="2">PROJECT DETAILS</th>
        </tr>
  
        <tr>
            <th>1</th>
            <td>Project Name</td>
            <td>${data.projectName}</td>
        </tr>
  
        <tr>
            <th>2</th>
            <td>Category</td>
            <td>${category.category}</td>
        </tr>
        
        <tr>
            <th>3</th>
            <td>Tags</td>
            <td>${data.tags}</td>
        </tr>

        <tr>
            <th>4</th>
            <td>Technology</td>
            <td>${data.technology}</td>
        </tr>

        <tr>
        <th>4</th>
        <td>Status</td>
        <td>${data.status}</td>
    </tr>
  
    </table>
    <pre style="font-size:17px;color : black">Best regards,
    Pro Themers</pre>


    `
    });

    console.log("Message sent: %s", info.messageId);
}


exports.sequre = async function (req, res, next) {
    try {
      let token = req.headers.authorization
      if (!token) {
        throw new Error('please send Token')
      }
      var decoded = jwt.verify(token, 'KEY');  // invalid signature (for wrong key) , jwt malformed(For wrong token)
      let userCheck = await ADMIN.findById(decoded.id) //if id is wrong throw this msg
      if (!userCheck) {
        throw new Error("user not found")
      }
      req.userId = decoded.id
      next()
    } catch (error) {
      res.status(404).json({
        status: "Fail",
        message: error.message
      })
    }
  }

//ADMIN
exports.AdminSignup = async function (req, res, next) {
    try {
        if (!req.body.email || !req.body.pass) {
            throw new Error('Enter All Fields')
        }

        req.body.pass = await bcrypt.hash(req.body.pass, 8)
        let dataCreate = await ADMIN.create(req.body)
        

        res.status(201).json({
            status: "Success",
            message: "Admin Signup Successfully",
            data: dataCreate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.AdminLogin = async function (req, res, next) {
    try {
        if (!req.body.email || !req.body.pass) {
            throw new Error('Enter All Fields')
        }
        let dataFind = await ADMIN.findOne({ email: req.body.email })
        if (!dataFind) {
            throw new Error("Username Not Found")
        }
        let passwordverify = await bcrypt.compare(req.body.pass, dataFind.pass)
        if (!passwordverify) {
            throw new Error("password is worng")
        }
        var token = jwt.sign({ id: dataFind._id }, 'KEY')
        res.status(201).json({
            status: "Success",
            message: "Admin login Successfully",
            data: dataFind,
            token
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


//CATEGORY


exports.CategoryCreate = async function (req, res, next) {
    try {
        req.body.image = req.file.filename
        if (!req.body.category || !req.body.image || !req.body.description) {
            throw new Error('Enter All Fields')
        }

        let dataCreate = await CATEGORY.create(req.body)

        res.status(201).json({
            status: "Success",
            message: "Category Create Successfully",
            data: dataCreate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.CategoryFind = async function (req, res, next) {
    try {
        let dataFind = await CATEGORY.find()
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
 

exports.CategoryUpdate = async function (req, res, next) {
    try {
        if(req.file){
            req.body.image = req.file.filename
        }
        let dataUpdate= await CATEGORY.findByIdAndUpdate(req.params.id , req.body , {new : true})
        
        res.status(201).json({
            status: "Success",
            message: "Category Update Successfully",
            data: dataUpdate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.CategoryDelete = async function (req, res, next) {
    try {
        let dataDelete= await CATEGORY.findByIdAndDelete(req.params.id)
        res.status(201).json({
            status: "Success",
            message: "Category Delete Successfully",
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}

//PROJECT

exports.ProjectFind = async function (req, res, next) {
    try {
        let dataFind = await PROJECT.find().populate("user")
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


exports.ProjectUpdate = async function (req, res, next) {
    try {
        let dataUpdate= await PROJECT.findByIdAndUpdate(req.params.id , req.body , {new : true})
        let category = await CATEGORY.findOne({_id : dataUpdate.category})
        let user = await USER.findOne({_id : dataUpdate.user})
        if(req.body.status){
            main(dataUpdate,category,user)
        }
        res.status(201).json({
            status: "Success",
            message: "Project Update Successfully",
            data: dataUpdate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.ProjectDelete = async function (req, res, next) {
    try {
        let dataDelete= await PROJECT.findByIdAndDelete(req.params.id)
        res.status(201).json({
            status: "Success",
            message: "Project Delete Successfully",
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}



