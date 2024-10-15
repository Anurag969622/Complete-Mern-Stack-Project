const user = require("../models/user.js");

module.exports.signupForm = (req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new user({email,username});
        const registereduser = await user.register(newUser,password);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","New user registered successfully");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.login = (req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.loginAuthentication = async (req,res)=>{
    req.flash("success","Welcome back to wanderlust");
    if(!res.locals.redirectUrl){
        return res.redirect("/listings");
    }else{
        res.redirect(res.locals.redirectUrl);//after loggin in pasport can change the redirecturl so we'll save them in locals
    }
}

module.exports.logout = async (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are Logged Out!");
        return res.redirect("/listings");
    })
}