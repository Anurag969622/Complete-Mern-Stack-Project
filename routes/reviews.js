const express = require("express");
const router = express.Router({mergeParams:true});//to access the id of listing from parent route
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const {isLoggedIn,isAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

const validateReviews = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }else{
        next();
    }
}

//CREATE REVIEWS
router.post("/",isLoggedIn,validateReviews,reviewController.createReviews)


//DELETE REVIEWs
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReviews));

module.exports = router;