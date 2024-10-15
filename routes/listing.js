const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const {isLoggedIn,isOwner}  = require("../middleware.js");
const multer = require("multer");

const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }else{
        next();
    }
}

const listingController = require("../controller/listings.js")

//INDEX ROUTE
router.get("/",wrapAsync(listingController.index))

//New Route
router.get("/new",isLoggedIn,(listingController.renderNewForm))

//CREATE ROUTE
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createNewListing));

//SHOW ROUTE
router.get("/:id",wrapAsync(listingController.showListing))

//Edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.editListing));

//DestroY route
router.delete("/:id",isLoggedIn,wrapAsync(listingController.deleteListing));

module.exports = router;