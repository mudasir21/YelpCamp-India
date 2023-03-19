const User = require('../models/user');

module.exports.renderLogin = (req, res) => {
    res.render('user/login.ejs');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // we dont want the path to be in our session so we delete it
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.renderRegister = (req, res) => {
    res.render("user/register.ejs");
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email: email, username: username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            else {
                req.flash('success', "Welcome to yelpcamp");
                res.redirect('/campgrounds');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);

        else {
            req.flash('success', 'Goodbye!!');
            res.redirect('/campgrounds');
        }
    });
}