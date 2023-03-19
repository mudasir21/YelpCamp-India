const Campground = require('../models/campground');
const Review = require('../models/reviews');


module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    // $pull is an function in js which allows to delete all instances of an object
    await Campground.findByIdAndUpdate(id, { $pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted the review');

    res.redirect(`/campgrounds/${id}`);
}

module.exports.uploadReview = async(req, res) => {
    // res.send("you made it ;;;;;;;;;;");
    const campground = await Campground.findById(req.params.id);
    const review = await Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'review posted');
   res.redirect(`/campgrounds/${campground._id}`)

}