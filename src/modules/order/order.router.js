const { UserRoles } = require("../../config/constants");
const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const { AddToCartDTO, UpdateCartDTO, CheckoutDTO, PaymentInitiateDTO } = require("./order.contract");
const orderCtrl = require("./order.controller");

const orderRouter = require("express").Router();

// Creating cart, listing and updating
orderRouter.post("/add-to-cart", checkLogin([UserRoles.ADMIN, UserRoles.SELLER]), bodyValidator(AddToCartDTO), orderCtrl.addToCart);
orderRouter.get("/cart-list", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), orderCtrl.getMyCartList);
orderRouter.patch("/cart-update/:cartId", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), bodyValidator(UpdateCartDTO), orderCtrl.updateOrRemoveFromCart);

// Checkout cart -> order
orderRouter.post("/checkout", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), bodyValidator(CheckoutDTO), orderCtrl.checkoutOrder);
orderRouter.get("/order-list", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), orderCtrl.getMyOrderList);

// Payment route of order
orderRouter.post("/initiate-payment", checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]), bodyValidator(PaymentInitiateDTO), orderCtrl.initiatePayment);
orderRouter.get("/payment-status", orderCtrl.paymentStatus);

module.exports = orderRouter;