const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.register = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);

        req.login(regUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds');
        })
        
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/campgrounds');
    });
};