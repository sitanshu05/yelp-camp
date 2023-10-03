const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const geocoder = mbxGeocoding({accessToken : process.env.MAPBOX_TOKEN});

const index = catchAsync(async (req,res)=>{
    const camps = await Campground.find({});
    res.render('campgrounds/index' , {camps});
});

const renderNewForm = (req,res)=>{
    res.render("campgrounds/new")
};

const createCampgrounds = catchAsync(async (req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send();
    const images = req.files.map( f => {
        return {url:f.path,filename : f.filename}
    });
    const postDet = {...req.body.campground,author:req.user._id,images : images, geometry : geoData.body.features[0].geometry };
    await Campground.create(postDet)
    req.flash('success','Campground Created!')
    res.redirect(`/campgrounds`)
});

const getCampground = catchAsync(async (req,res)=>{
    const camp = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path : 'author'
        }
    }).populate('author');

    if(!camp){
        req.flash('error',"cannot find that camp");
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", {camp}); 
});

const renderEditForm = catchAsync(async(req,res)=>{

    const camp = await Campground.findById(req.params.id);
    if(!camp){
        req.flash('error',"cannot find that camp");
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit",{camp});
});

const editCampground = catchAsync(async(req,res)=>{
    console.log(req.body)
    const images = req.files.map( f => {
        return {url:f.path,filename : f.filename}
    });
    const camp = await Campground.findByIdAndUpdate(req.params.id,req.body.campground)
    camp.images.push(...images);
    if(req.body.deleteImages){
        for(let file of req.body.deleteImages){
            await cloudinary.uploader.destroy(file);
        }
        await camp.updateOne({$pull : {images : {filename : {$in : req.body.deleteImages}}}})
    }
    await camp.save();


    req.flash('success',`Successfully Updated`)
    res.redirect(`/campgrounds/${req.params.id}`)
});

const deleteCampground = catchAsync(async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success",'Successfully deleted camp');
    res.redirect("/campgrounds");
})



module.exports = {index,renderNewForm,createCampgrounds,getCampground,renderEditForm,editCampground,deleteCampground}