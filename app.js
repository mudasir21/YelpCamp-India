if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const expressError = require('./utils/expressErrors');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const session = require('express-session');
const flash = require('connect-flash');

// routes
const reviewRoutes = require('./routes/reviews');
const campgroundRoutes = require('./routes/campgrounds');
const userRoutes = require('./routes/user');

// for authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/YelpCamp', { useNewUrlParser: true })
    .then(() => {
        console.log("it worked ");
    })
    .catch(() => {
        console.log("ERROR ! check connection");
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
    secret : 'thisshouldbeasecret',
    save : false,
    resave : true,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,        // this is for security look for it for more info
        expires : Date.now() + 1000*60*60*24*7,          // date.now returns data in milliscs so adding expiration after a week
        maxAge : 1000*60*60*24*7

    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
});



// make sure to use passport sessions after session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);



app.get('/fakeuser', async (req, res) => {
    const user = new User({email : 'mudasir@gmail.com', username : 'mudasir13',});
    // now register will take the schema with password and behind the scenes do what bcrypt used to do that is hash password on its own
    const registeredUser = await User.register(user,  'mudasir@13');
    res.send(registeredUser);
})

app.get('/', (req, res) => {

    res.render('home.ejs');
    // res.send("hello from yelpCamp -- kashmir");     if u r trying to response after directing to some other place or even after any response u r trying to send another response it will give an error : cant set headers after they are sent to client
});




app.all('*', (req, res, next) => {      // this will execute everytime if anything above has not matched
    next(new expressError("Page Not Found", 404));
});


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went Wrong';
    res.render('error.ejs', { err });
})




// app.get('/makecampground', async (req, res ) => {

// });

app.listen(8000, () => {
    console.log("listening port 8000");
});