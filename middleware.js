const Campground = require('./models/campground');
const { campgroundSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressErrors');
module.exports.isLoggedIn = (req , res, next) => {


    if(!req.isAuthenticated()){
        req.flash('error', 'You must signin first');
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}


module.exports.validateCampground = (req, res, next) => {
    // manually to check for empty fields we can do : id(!req.body.campground)  /* campground : coz it encloses all parameters into an array : see form*/ throw new errorApp("errrroooorr"
    // using joi 
    const { err } = campgroundSchema.validate(req.body);

    if (err) {
        const msg = err.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    }
    else {
        next();
    }
}; 
/////////                          bug somewhere
/*
module.exports.isAuthor = catchAsync( async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error', 'PERMISSION DENIED');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();

})

*/