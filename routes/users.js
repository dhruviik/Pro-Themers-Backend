var express = require('express');
var router = express.Router();
const UserControllers = require('../controllers/users')
const AdminController = require('../controllers/admin')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })


/* GET Users listing. */
router.post('/signup', upload.single('profilepic'), UserControllers.UserSignup);

router.post('/login', UserControllers.UserLogin);

router.get('/read', UserControllers.sequre, UserControllers.UserFind);

router.get('/alldata/read', AdminController.sequre, UserControllers.UserRead);

router.patch('/update', upload.single('profilepic') ,UserControllers.sequre, UserControllers.UserUpdate);

router.patch('/login/forget-pass', UserControllers.Forgetpass);

router.patch('/login/verify', UserControllers.verify);

router.post('/login/check', UserControllers.Check);





/* GET Project listing. */
router.post('/project/create', upload.fields([{ name: 'projectZip', maxCount: 1 }, { name: 'screenshorts', maxCount: 3 }]), UserControllers.sequre, UserControllers.ProjectCreate);

router.get('/project/userread', UserControllers.sequre, UserControllers.ProjectuserdataFind);

router.patch('/project/update/:id', upload.fields([{ name: 'projectZip', maxCount: 1 }, { name: 'screenshorts', maxCount: 3 }]), UserControllers.sequre, UserControllers.ProjectUpdate);



/* GET Profile listing. */
router.patch('/profile/change-pass', UserControllers.sequre, UserControllers.ChangePass);





module.exports = router;
