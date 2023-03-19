const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressErrors');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const ejsMate = require('ejs-mate');
const { isLoggedIn, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/index');           // node automatically searches for index if not given which one to choose form folder
const upload = multer({ storage })

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.post('/',isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


// add isAuthor 
router.get('/:id', catchAsync(campgrounds.showCampground));

// editing the data route    -- add isAuthor
router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.editCampground));

router.put('/:id', isLoggedIn, upload.array('image') ,validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', catchAsync(campgrounds.deleteCampground));

module.exports = router;


/*                    another way
another way of resructuring is to chain all those having same path but differnet methods using router.route
   like :
            router.route('path')
               .get(func)
               .post(func)
               .delete(func)
*/

