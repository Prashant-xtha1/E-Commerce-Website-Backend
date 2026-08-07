const { UserRoles } = require("../../config/constants");
const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const { AddToCartDTO } = require("./order.contract");
const orderCtrl = require("./order.controller");

const orderRouter = require("express").Router();

orderRouter.post("/add-to-cart", checkLogin([UserRoles.ADMIN, UserRoles.SELLER]), bodyValidator(AddToCartDTO), orderCtrl.addToCart);

module.exports = orderRouter;