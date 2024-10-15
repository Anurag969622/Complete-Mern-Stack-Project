const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

router.get("/signup",userController.signupForm);

router.post("/signup",userController.signup)

router.get("/login",userController.login)

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}),userController.loginAuthentication);

router.get("/logout",userController.logout);

module.exports = router;