const Review = require('../models/review')
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');

const postReview = catchAsync(async (req,res)=>{
    const campground =  await Campground.findById(req.params.id);
    const reviewDetails = {...req.body.review,author : req.user._id}
    const review = await Review.create(reviewDetails);
    campground.reviews.push(review);
    await campground.save();
    req.flash('success',"Created new review")
    res.redirect(`/campgrounds/${campground._id}`)
});

const deleteReview = catchAsync(async (req,res,next)=>{
    await Review.findByIdAndDelete(req.params.reviewId);
    await Campground.findByIdAndUpdate(req.params.id, {$pull : {reviews: req.params.reviewId}});
    req.flash("success",'Successfully deleted review');
    res.redirect(`/campgrounds/${req.params.id}`)
});

module.exports = {postReview,deleteReview}