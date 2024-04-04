const USER = require('../models/users')
const bcrypt = require('bcrypt')
const PROJECT = require('../models/projects')
const CATEGORY = require('../models/category')
var jwt = require('jsonwebtoken');
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

async function main(data, category, user) {
    const info = await transporter.sendMail({
        from: 'patelbhargav44397@gmail.com',
        to: user.email,
        subject: "Project Update Record",
        text: "",
        html: `
            <b>Dear ${user.fname.charAt(0).toUpperCase() + user.fname.substring(1) + ' ' + user.lname.charAt(0).toUpperCase() + user.lname.substring(1)} <b> ,
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



async function main2(email, otp, user) {
    const info = await transporter.sendMail({
        from: 'patelbhargav44397@gmail.com',
        to: email,
        subject: "Email Verification📩",
        text: "",
        html: `
        <b>Dear ${user.fname.charAt(0).toUpperCase() + user.fname.substring(1) + ' ' + user.lname.charAt(0).toUpperCase() + user.lname.substring(1)}, <b>
        <p> We received a request to reset your password for your account with Pro Themer's.<br>
        To proceed with the password reset,please use the following One-Time Password(OTP):<br><br>
        <p style ="border : 1px solid black; background-color : lavender; width : 10% ; height : 40px; text-align : center; padding-top:17px;">OTP:${otp}</p><br>
        Please do not share this OTP with anyone for security reasons.<br><br>
        If you did not request a password reset , please ignore this email.Your account remains secure.
        </p>

        <pre style="font-size:17px;color : black">Best regards,
         Pro Themers</pre>
        `

    });

    console.log("Message sent: %s", info.messageId);
}



exports.sequre = async function (req, res, next) {
    try {
        let token = req.headers.authorization
        // console.log(token);
        if (!token) {
            throw new Error('please send Token')
        }
        var decoded = jwt.verify(token, 'KEY');  // invalid signature (for wrong key) , jwt malformed(For wrong token)
        //   console.log(decoded);
        let userCheck = await USER.findById(decoded.id) //if id is wrong throw this mshg


        req.userId = decoded.id

        if (!userCheck) {
            throw new Error("User not found!")
        }
        next()
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}


//USER
exports.UserSignup = async function (req, res, next) {
    try {
        req.body.profilepic = req.file.filename
        if (!req.body.fname || !req.body.email || !req.body.pass || !req.body.lname) {
            throw new Error('Enter All Fields')
        }

        let user = await USER.findOne({ email: req.body.email })
        if (user) {
            throw new Error('User Already Exited! change your Email Id!')
        }

        req.body.pass = await bcrypt.hash(req.body.pass, 8)
        let dataCreate = await USER.create(req.body)


        var token = jwt.sign({ id: dataCreate._id }, 'KEY')
        res.status(201).json({
            status: "Success",
            message: "Registration Successfully",
            data: dataCreate,
            token
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}



exports.UserLogin = async function (req, res, next) {
    try {
        if (!req.body.email || !req.body.pass) {
            throw new Error('Enter All Fields')
        }
        let dataFind = await USER.findOne({ email: req.body.email })
        req.email = req.body.email
        console.log(req.email);
        if (!dataFind) {
            throw new Error("Email id Not Found!")
        }
        let passwordverify = await bcrypt.compare(req.body.pass, dataFind.pass)
        if (!passwordverify) {
            throw new Error("password is wrong")
        }
        var token = jwt.sign({ id: dataFind._id }, 'KEY')
        res.status(201).json({
            status: "Success",
            message: "Login Successfully",
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


exports.UserFind = async function (req, res, next) {
    try {

        let dataFind = await USER.findOne({ _id: req.userId })

        res.status(201).json({
            status: "Success",
            message: "OneUser Found Successfully",
            data: dataFind
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.UserRead = async function (req, res, next) {
    try {

        let dataRead = await USER.find()

        res.status(201).json({
            status: "Success",
            message: "All Data Found Successfully",
            data: dataRead
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.UserUpdate = async function (req, res, next) {
    try {
        let user = await USER.findOne({ email: req.body.email })
        console.log(user !== null);
        if (user !== null) {
            if (user.id !== req.userId) {
                throw new Error('User Already Exited! Change your Email Id!')
            }
        }


        if (req.file) {
            req.body.profilepic = req.file.filename
        }

        var dataUpdate = await USER.findByIdAndUpdate({ _id: req.userId }, req.body, { new: true })

        res.status(201).json({
            status: "Success",
            message: "Profile Update Successfully",
            data: dataUpdate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}



//FORGET PASSWORD

exports.verify = async function (req, res, next) {
    try {
        

        if (req.body.email) {
            let otp = Math.floor(Math.random() * 100000) + 1
            var otpupdate = await USER.findOneAndUpdate({ email: req.body.email }, { otp: otp }, { new: true })
            if (!otpupdate) {
                throw new Error('Email id Not Found!')
            }
            main2(req.body.email, otp, otpupdate)
        }
        let otpFind = await USER.findOne({ email: req.body.email })
        res.status(201).json({
            status: "Success",
            message: "Email Verify Successfully",
            data: otpFind
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}

exports.Check = async function (req, res, next) {
    try {
            let otpFind = await USER.findOne({ email: req.body.email })
            
        
        res.status(201).json({
            status: "Success",
            message: "Otp Data Found Successfully",
            data: otpFind.otp
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}

exports.Forgetpass = async function (req, res, next) {
    try {

        if (!req.body.email || !req.body.confirmpass || !req.body.pass) {
            throw new Error('Please enter fields')
        }
        if (req.body.pass !== req.body.confirmpass) {
            throw new Error('Password Is Not Match')
        }
        req.body.pass = await bcrypt.hash(req.body.pass, 8)
        req.body.confirmpass = await bcrypt.hash(req.body.confirmpass, 8)
        let dataupdate = await USER.findOneAndUpdate({ email: req.body.email }, req.body, { new: true })

        if (!dataupdate) {
            throw new Error('Email id Not Found!')
        }
        res.status(201).json({
            status: "Success",
            message: "Password Change Successfully",
            data: dataupdate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}





//PROJECT
exports.ProjectCreate = async function (req, res, next) {
    try {
        // console.log(req.files);
        req.body.projectZip = req?.files?.projectZip?.map((el) => el.filename) || []
        req.body.screenshorts = req?.files?.screenshorts?.map((el) => el.filename) || []

        if (!req.body.projectName || !req.body.category || !req.body.technology || !req.body.projectLink || !req.body.projectZip || !req.body.screenshorts) {
            throw new Error('Enter All Fields')
        }
        req.body.user = req.userId
        let dataCreate = await PROJECT.create(req.body)
        let dataFind = await PROJECT.findOne({ _id: dataCreate._id })
        let category = await CATEGORY.findOne({ _id: dataCreate.category })
        let user = await USER.findOne({ _id: dataCreate.user })


        main(dataFind, category, user)
        res.status(201).json({
            status: "Success",
            message: "Project Create Successfully",
            data: dataCreate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}


exports.ProjectuserdataFind = async function (req, res, next) {
    try {
        let dataFind = await PROJECT.find({ user: req.userId }).populate(["user", "category"])
        // console.log(decoded.id);
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
        if (req.files) {
            req.body.projectZip = req?.files?.projectZip?.map((el) => el.filename)
            req.body.screenshorts = req?.files?.screenshorts?.map((el) => el.filename)
        }
        let dataUpdate = await PROJECT.findByIdAndUpdate(req.params.id, req.body, { new: true })
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





//CHANGE PASSWORD
exports.ChangePass = async function (req, res, next) {
    try {

        if (!req.body.currentpass || !req.body.pass || !req.body.confirmpass) {
            throw new Error('Enter All Fields')
        }

        let dataFind = await USER.findById(req.userId)
        console.log(dataFind);
        let passwordverify = await bcrypt.compare(req.body.currentpass, dataFind.pass)
        if (!passwordverify) {
            throw new Error("Invalid Current Password")
        }

        if (req.body.pass !== req.body.confirmpass) {
            throw new Error("New Password and Re-enter New Password can't same")
        }


        req.body.pass = await bcrypt.hash(req.body.pass, 8)
        req.body.confirmpass = await bcrypt.hash(req.body.confirmpass, 8)
        let dataupdate = await USER.findByIdAndUpdate(req.userId, req.body, { new: true })


        res.status(201).json({
            status: "Success",
            message: "Password Change Successfully",
            data: dataupdate
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message
        })
    }
}




