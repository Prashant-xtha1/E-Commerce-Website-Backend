const authRouter = require("../modules/authentication/auth.router");
const brandRouter = require("../modules/brand/brand.router");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/brand", brandRouter);

module.exports = router;