const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const {reviewSchema} = require('../schemas');
const methodOverride = require('method-override');
const reviews = require('../controllers/reviews');


router.use(methodOverride('_method'));

const validateReviews = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const err = error.details.map(el => el.message).join(',');
        throw new expressError(err, 402);
    }
    else
      next();
}

router.delete('/:reviewId', catchAsync( reviews.deleteReview));

// route for reviews
router.post('/', validateReviews, catchAsync(reviews.uploadReview));

module.exports = router;