const mongoose = require("mongoose");
const Review = require("./reviews.js");
const listingSSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image  : {
       url : String,
       filename : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Reviews",
        },
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
    },
});

listingSSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("listing",listingSSchema);
module.exports = Listing;
