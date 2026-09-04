const authRouter = require("../modules/authentication/auth.router");
const brandRouter = require("../modules/brand/brand.router");
const categoryRouter = require("../modules/category/category.router");
const chatRouter = require("../modules/chat/chat.router");
const orderRouter = require("../modules/order/order.router");
const productRouter = require("../modules/product/product.router");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/brand", brandRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);
router.user("/chat", chatRouter);

module.exports = router;