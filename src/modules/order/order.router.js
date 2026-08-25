const { UserRoles } = require("../../config/constants");
const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const { AddToCartDTO, UpdateCartDTO, CheckoutDTO } = require("./order.contract");
const orderCtrl = require("./order.controller");

const orderRouter = require("express").Router();

orderRouter.post("/add-to-cart", checkLogin([UserRoles.ADMIN, UserRoles.SELLER]), bodyValidator(AddToCartDTO), orderCtrl.addToCart);
orderRouter.get("/cart-list", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), orderCtrl.getMyCartList);
orderRouter.patch("/cart-update/:cartId", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), bodyValidator(UpdateCartDTO), orderCtrl.updateOrRemoveFromCart);

orderRouter.post("/checkout", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), bodyValidator(CheckoutDTO), orderCtrl.checkoutOrder);
orderRouter.get("/order-list", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), orderCtrl.getMyOrderList);

module.exports = orderRouter;