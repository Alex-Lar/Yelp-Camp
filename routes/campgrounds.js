const express = require('express');
const router = express.Router();

const { campgroundSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


//? Routes
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// Create a new camp
router.post('/', validateCampground, catchAsync(async(req, res, next) => {
    let campground = new Campground(req.body.campground);
    await campground.save();

    req.flash('success', 'Successfully made a new campground!');
    req.flash('error', 'Error! You cant create new campground!');
    
    res.redirect(`/campgrounds/${campground._id}`);   
}));

// Show a campground
router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
})); 

router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
}));

module.exports = router;