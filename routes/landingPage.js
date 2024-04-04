var express = require('express');
var router = express.Router();
const LandingPageControllers = require('../controllers/landingPage')
 
router.get('/category/allread/:id', LandingPageControllers.CategoryFind);

router.get('/project/read/:id', LandingPageControllers.ProjectFind);


router.patch('/project-details/update/:id', LandingPageControllers.ProjectDownloadsUpdate);

module.exports = router;