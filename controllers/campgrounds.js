const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');
const expressError = require('../utils/expressErrors');
const mpbxGeooding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken = process.env.MAPBOX_TOKEN;
const geoCoder = mpbxGeooding({accessToken : mapboxtoken});



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });

}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground = async (req, res, next) => {
    const geocode = await geoCoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send()
 
    console.log(geocode.body.features[0].geometry);

    const campground = new Campground(req.body.campground);
    campground.geometry = geocode.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground.images);
    req.flash('success', "successfully created campground");
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    res.render('campgrounds/show.ejs', { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', "Campground not found");
        return res.redirect('/camgrounds');
    }
    res.render('campgrounds/edit.ejs', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();

    if(req.body.deleteImages)
    {
        for(image of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(image);
        }
        await campground.updateOne({$pull : {images : {filename : {$in : req.body.deleteImages}}}});
        // console.log(campground);
        console.log('campgrounds updated');
    }

    req.flash('success', 'successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground');
    res.redirect('/campgrounds');
}