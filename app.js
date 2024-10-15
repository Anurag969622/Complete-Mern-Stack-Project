if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require('mongoose');
const app = express();
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const expressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const userRouter = require("./routes/user.js");
const user = require("./models/user.js");
const multer = require("multer");
const upload = multer({dest : "uploads/"});
const mongodb = require("mongodb");
const Listing = require("./models/listing.js");

const dbUrl = process.env.ATLASDB_URL;
console.log(dbUrl);

const Store = mongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

Store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions = {
    Store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true,//for cross-scripting attacks
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/trading');
}

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

app.get("/",async (req,res)=>{
    let listings = await Listing.find();
    res.render("./listing/index.ejs",{listings});
})

app.all("*",(req,res,next)=>{
    next(new expressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
})

app.listen(8080,(req,res)=>{
    console.log("App is listening on port");
})