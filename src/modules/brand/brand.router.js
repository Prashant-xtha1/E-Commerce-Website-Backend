const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const brandCtrl = require("./brand.controller");
const { BrandDTO } = require("./brand.validator");

const brandRouter = require("express").Router()

brandRouter.get("/:slug/detail", brandCtrl.getDetailBySlug);
brandRouter.get("/", checkLogin(), brandCtrl.listAll);

brandRouter.post("/", checkLogin(['seller']), uploader().single("logo"), bodyValidator(BrandDTO), brandCtrl.create);

brandRouter.get("/:brandId", brandCtrl.getDetail);
brandRouter.put("/:brandId", brandCtrl.update);
brandRouter.delete("/:brandId", brandCtrl.delete);


module.exports = brandRouter;