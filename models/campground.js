const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true}};

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
    title: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a class='link link-primary' href='/campgrounds/${this._id}'>${this.title}</a></strong>
    <p class="text-muted my-2">${this.description.substring(0, 30)}...</p>
    `
})

CampgroundSchema.post('findOneAndDelete', async function (camp) {
    if (camp.reviews.length) {
        await Review.deleteMany({
            _id: {
                $in: camp.reviews
            }
        });
    }
});


module.exports = mongoose.model('Campground', CampgroundSchema);