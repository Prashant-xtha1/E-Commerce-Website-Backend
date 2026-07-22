const authRouter = require("../modules/authentication/auth.router");
const brandRouter = require("../modules/brand/brand.router");
const categoryRouter = require("../modules/category/category.router");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/brand", brandRouter);
router.use("/category", categoryRouter);

module.exports = router;