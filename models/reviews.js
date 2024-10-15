const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5,
    },
    created_At : {
        type : Date,
        default : Date.now(),
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
    }
});

module.exports = new mongoose.model("Reviews",reviewSchema);