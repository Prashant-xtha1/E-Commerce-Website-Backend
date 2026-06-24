const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const authCtrl = require("./auth.controller");
const { LoginDTO, RegisterDTO } = require("./auth.validator");

const authRouter = require("express").Router();

// authRouter.post("/register", "");
// authRouter.get("/activate/:token", "" );
authRouter.post("/register",uploader().single("image"), bodyValidator(RegisterDTO), authCtrl.registerUser);
authRouter.post("/activate/:token", authCtrl.activateUser);
authRouter.post("/re-activate/:token", authCtrl.resendActivationToken);
authRouter.get("/login", bodyValidator(LoginDTO), authCtrl.loginUser);
authRouter.get("/me", checkLogin, authCtrl.getLoggedInUser);

module.exports = authRouter;