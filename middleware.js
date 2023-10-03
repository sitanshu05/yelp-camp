const Campground = require("./models/campground");
const schemas = require("./schema");
const Review = require("./models/review");
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync')


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{

    const campgroundSchema = schemas.campgroundSchema;
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,msg)
    }else{
        next();
    }
};

module.exports.isAuthor = (catchAsync(async(req,res,next) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do this");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}));

module.exports.isReviewAuthor = (catchAsync(async(req,res,next) =>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You do not have permission to do this");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}));

module.exports.validateReview = (req,res,next)=>{
    const reviewSchema = schemas.reviewSchema 

    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,msg)
    }else{
        next();
    }
};
