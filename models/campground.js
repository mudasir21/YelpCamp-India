
const mongoose = require('mongoose');
const Review = require('./reviews');
mongoose.set('strictQuery', true);

// mongoose.connect('mongodb://localhost:27017/YelpCamp', {useNewUrlParser : true})
// .then(() => {
//     console.log("it worked ");
// })
// .catch(() => {
//     console.log("error occured");
//     console.log(err);
// });

// url: 'https://res.cloudinary.com/dkwb81hrj/image/upload/v1676647085/YelpCamp/ef2bpb80x7smtvjh7iuf.avif'

const imageSchema = new mongoose.Schema({
    url : String,
    filename : String
})

const opts = {toJSON : {virtuals : true}};

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_200')        // replace with width-200px (cloudinary technique)
})


const campgroundSchema = new mongoose.Schema({
    title: String,
    price: {
        type: Number,
        minimum: [0, 'check the price'],
        required: true
    },
    images: [imageSchema],
    description: String,
    location: String,

    geometry : {
        type : 
        {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : 
        {
            type : [Number],
            required : true

        }
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        }

    ]
},opts)

// for popup in map , mapbox expects to have the popup somewhere in schema model under properties : {} just like features , so we will make a virtial one 

campgroundSchema.virtual('properties.popUpMarkUp').get(function(){            // thus we injected into schema this : properties : {
                                                                                //                                                     markUpPopUp{ htmltag : "string"} }
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }

})

// now i will create the model and export it at the same time
module.exports = mongoose.model('Campground', campgroundSchema);