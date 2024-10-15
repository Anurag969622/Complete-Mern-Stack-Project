const mongoose = require("mongoose");
const initdata = require("./data.js");

const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/trading');
}

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

const initDatabase = async()=>{
    await Listing.deleteMany();
    let data = initdata.data;
    await Listing.insertMany(data);
    console.log("New data Saved");
}

initDatabase();