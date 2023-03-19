const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({                // one that youre seeing on website is client side errorHandling and this is setver side error handling and the campgroundSchema here is not that of mongoose but we created it using joy for server side
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),

    deleteImages : Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(0).max(5),
        body : Joi.string().required()
    }).required()
})