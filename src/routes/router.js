const authRouter = require("../modules/authentication/auth.router");

const router = require("express").Router();

router.use("/auth", authRouter);

module.exports = router;