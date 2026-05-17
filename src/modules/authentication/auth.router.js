const authCtrl = require("./auth.controller");

const authRouter = require("express").Router();

// authRouter.post("/register", "");
// authRouter.get("/activate/:token", "" );
authRouter.get("/login", authCtrl.loginUser);

module.exports = authRouter;