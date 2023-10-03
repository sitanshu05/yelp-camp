const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("../models/campground");
const {descriptors , places} = require("./seedHelpers");
const cities = require('./cities');

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

    const sample = array => array[Math.floor(Math.random() * array.length)];

    const even = [
        {
            url : "https://res.cloudinary.com/deoo4rgoh/image/upload/v1696273009/YelpCamp/fkrcb0hndhhp4yyocvow.jpg",
            filename : 'YelpCamp/fkrcb0hndhhp4yyocvow'
        },
        {
            url : "https://res.cloudinary.com/deoo4rgoh/image/upload/v1696273079/YelpCamp/vrnbqpcadiz8c3z36hlj.jpg",
            filename : "YelpCamp/vrnbqpcadiz8c3z36hlj"
        }
    ]
    const odd = [
        {
            url : "https://res.cloudinary.com/deoo4rgoh/image/upload/v1696273011/YelpCamp/zddckiso2znwdqtqrecd.jpg",
            filename : 'YelpCamp/zddckiso2znwdqtqrecd'
        },
        {
            url : "https://res.cloudinary.com/deoo4rgoh/image/upload/v1696273079/YelpCamp/vrnbqpcadiz8c3z36hlj.jpg",
            filename : "YelpCamp/vrnbqpcadiz8c3z36hlj"
        }
    ]


    const seedDB = async () => {
        await Campground.deleteMany({});
        for (let i = 0; i < 400; i++) {
            const random1000 = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 20) + 10;
            
            const camp = new Campground({
                author : "6519cad546a906656b753d03",
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                images : i%2 == 0 ? even : odd,
                description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum magnam repudiandae placeat, amet enim libero asperiores ratione doloremque inventore laudantium quia quos tenetur quam fugiat distinctio vel debitis explicabo recusandae.",
                price : price,
                geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude] }
            })
            await camp.save();
        }
    }
    
    seedDB().then(() => {
        mongoose.connection.close();
    })