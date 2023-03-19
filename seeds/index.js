const mongoose = require('mongoose');
const { descriptions, places } = require('./seedhelpers');
const Campground = require('../models/campground');
const { cities } = require('./citiesLess');
mongoose.set('strictQuery', true);

console.log(cities[0].latitude+ "  "+ cities[0].longitude)
              

mongoose.connect('mongodb://localhost:27017/YelpCamp', { useNewUrlParser: true })
    .then(() => {
        console.log("it worked ");
    })
    .catch(() => {
        console.log("error occured");
        console.log(err);
    });

const size = cities.length;
console.log(size);

console.log(places);
// const sample = (array) => array[Math.floor(Math.random()*array.length)] ;    // array.length is showing error

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < size; i++) {
        let randomNum = Math.floor(Math.random() * 75);         // coz size if 75
        let randomSmall = Math.floor(Math.random() * 10);
        const newCamp = new Campground(
            {
                author: '63eda326bf2feb75db519336',
                title: `${descriptions[randomSmall]} ${places[randomSmall]}`, // alternate way is to create a function and pass arguments like below step
                // title : `${sample(descriptions)} ${sample.places}`,
                location: `${cities[randomNum].name}`,
                description: ' Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non reiciendis odit dolorum ducimus repellendus quaerat cumque est soluta placeat quos autem doloremque nobis porro, temporibus fugiat deserunt! Ex, inventore libero',
                price: Math.floor(Math.random() * 100),
                geometry: {
                    type: 'Point',
                    coordinates: [cities[randomNum].longitude, cities[randomNum].latitude]
                },

                images: [
                    {
                        
                        url:'https://images.unsplash.com/photo-1561287437-c69a30664793?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8a2FzaG1pciUyMG1vdW50YWluc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60'

                    },
                    {
                        url:'https://images.unsplash.com/photo-1560853950-2502ec2ab867?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzR8fGthc2htaXIlMjBtb3VudGFpbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60'
                    }
                        
                    //     url: 'https://res.cloudinary.com/dkwb81hrj/image/upload/v1676647085/YelpCamp/ef2bpb80x7smtvjh7iuf.avif',
                    //     filename: 'YelpCamp/ef2bpb80x7smtvjh7iuf'

                    // },
                    // {
                    //     url: 'https://res.cloudinary.com/dkwb81hrj/image/upload/v1676643665/YelpCamp/jvt97hkaviu3hzmhuzm0.jpg',
                    //     filename: 'YelpCamp/jvt97hkaviu3hzmhuzm0'

                    

                ]


            })

        await newCamp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    });

