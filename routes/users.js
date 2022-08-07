const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
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
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

// Passport magic goes here
router.post('/login', passport.authenticate('local', {   
    failureFlash: true, 
    failureRedirect: '/login', 
    keepSessionInfo: true, // Делает то, как
}), 
(req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
}); 


router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/campgrounds');
    });
}); 

module.exports = router;