const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const authCtrl = require("./auth.controller");
const { LoginDTO, RegisterDTO } = require("./auth.validator");

const authRouter = require("express").Router();

// authRouter.post("/register", "");
// authRouter.get("/activate/:token", "" );
authRouter.post("/register", bodyValidator(RegisterDTO), authCtrl.registerUser);
authRouter.get("/login", bodyValidator(LoginDTO), authCtrl.loginUser);
authRouter.get("/me", checkLogin, authCtrl.getLoggedInUser);

module.exports = authRouter;