const Listing = require("../models/listing.js");
const flash = require("connect-flash");

module.exports.index = async(req,res)=>{
    let listings = await Listing.find();
    res.render("./listing/index.ejs",{listings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listing/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews",populate : {path : "author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested,Does not exists!");
        res.redirect("/listings");
    }
    res.render("./listing/show.ejs",{listing});
}

module.exports.createNewListing = async (req,res)=>{
    let url =  req.file.path;
    let filename = req.file.filename;
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url,filename};
    await listing.save();
    req.flash("success","New Listing Saved!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(listing.image.url);
    if(!listing){
        req.flash("error","Listing you requested,Does not exists!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/upload","/upload/h_200,w_250");
    console.log(originalImageUrl);
    res.render("./listing/edit.ejs",{listing,originalImageUrl});
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url =  req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}