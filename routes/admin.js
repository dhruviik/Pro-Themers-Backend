var express = require('express');
var router = express.Router();
const AdminControllers = require('../controllers/admin')
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


/* GET Admin listing. */
router.post('/signup', AdminControllers.AdminSignup);

router.post('/login',  AdminControllers.AdminLogin);



/* GET Category listing. */
router.post('/category/create', upload.single('image') ,AdminControllers.CategoryCreate);


router.get('/category/read',AdminControllers.CategoryFind);


router.patch('/category/update/:id' ,upload.single('image'), AdminControllers.sequre ,AdminControllers.CategoryUpdate);


router.delete('/category/delete/:id', AdminControllers.sequre ,AdminControllers.CategoryDelete);
 
/* GET Project listing. */

router.get('/project/read', AdminControllers.sequre ,AdminControllers.ProjectFind);

router.patch('/project/update/:id', AdminControllers.sequre , AdminControllers.ProjectUpdate);


router.delete('/project/delete/:id', AdminControllers.ProjectDelete);
 

module.exports = router;