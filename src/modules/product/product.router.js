const { UserRoles } = require("../../config/constants");
const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const productCtrl = require("./product.controller");
const { ProductDTO } = require("./product.validator");

const productRouter = require("express").Router();

productRouter.post("/", checkLogin([UserRoles.SELLER]), uploader().array("images"), bodyValidator(ProductDTO), productCtrl.createProduct);

productRouter.get("/", checkLogin([UserRoles.SELLER]), productCtrl.getAllProducts);
productRouter.get("/:id", checkLogin([UserRoles.SELLER]), productCtrl.getProductDetailById);

productRouter.put("/:id", checkLogin([UserRoles.SELLER]), uploader().array("images"), bodyValidator(ProductDTO), productCtrl.updateProduct);

module.exports = productRouter;