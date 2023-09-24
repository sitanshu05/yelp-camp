const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind (console, "connection error:"));

db.once("open", () => 
    {
    console.log ("Database connected");
    });


const app = express();

app.engine ('ejs', ejsMate)  // set up template engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.get('/',(req,res)=>{
    res.render("index");
});

app.get("/campgrounds",async (req,res)=>{
    const camps = await Campground.find({});
    res.render('campgrounds/index' , {camps});
});

app.get("/campground/new", (req,res)=>{
    res.render("campgrounds/new")
});
app.post("/campgrounds", async (req,res)=>{
    await Campground.create(req.body.campground)
    res.redirect(`/campgrounds`)
});
app.get("/campground/:id", async (req,res)=>{

    const camp = await Campground.findById(req.params.id);
    res.render("campgrounds/show", {camp});
});
app.get("/campground/:id/edit", async(req,res)=>{
    const camp = await Campground.findById(req.params.id);
    res.render("campgrounds/edit",{camp});
});
app.put("/campground/:id",async(req,res)=>{
    await Campground.findByIdAndUpdate(req.params.id,req.body.campground,{runValidators : true, new: true});
    res.redirect(`/campground/${req.params.id}`)
});
app.delete("/campground/:id",async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
})



app.listen(3000,()=>{
    console.log('server is running on port 3000');
})