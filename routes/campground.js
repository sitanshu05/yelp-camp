const express = require("express");
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn,validateCampground,isAuthor} = require("../middleware");
const multer = require('multer');
const {storage} = require("../cloudinary")
const upload = multer({storage})
// const upload = multer({dest : 'uploads/'})



router.route("/")
    .get(campgrounds.index)
    .post(isLoggedIn,upload.array('image'),validateCampground, campgrounds.createCampgrounds);
    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.body,req.files);
    //     res.send("worked?");
    // })

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(campgrounds.getCampground)
    .put(isLoggedIn,isAuthor,upload.array('image'), validateCampground, campgrounds.editCampground)
    .delete(isLoggedIn,isAuthor,campgrounds.deleteCampground);


router.get("/:id/edit",isLoggedIn,isAuthor, campgrounds.renderEditForm);


module.exports = router;