const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const authCtrl = require("./auth.controller");
const { LoginDTO } = require("./auth.validator");

const authRouter = require("express").Router();

// authRouter.post("/register", "");
// authRouter.get("/activate/:token", "" );
authRouter.post("/register", bodyValidator(LoginDTO), authCtrl.registerUser);
authRouter.get("/login", authCtrl.loginUser);
authRouter.get("/me", checkLogin, authCtrl.getLoggedInUser);

module.exports = authRouter;