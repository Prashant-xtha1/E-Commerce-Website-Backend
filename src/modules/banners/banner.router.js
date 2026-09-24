const { UserRoles } = require("../../config/constants");
const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const bannerCtrl = require("./banner.controller");
const { BannerDTO } = require("./banner.validator");

const bannerRouter = require("express").Router();

bannerRouter.post("/", checkLogin([UserRoles.ADMIN]), uploader().single("image"), bodyValidator(BannerDTO), bannerCtrl.createBanner);

bannerRouter.get("/", checkLogin([UserRoles.ADMIN]), bannerCtrl.listBanner);
bannerRouter.get("/:bannerId", checkLogin([UserRoles.ADMIN]), bannerCtrl.getBannerDetailById);

bannerRouter.put("/:bannerId", checkLogin([UserRoles.ADMIN]), uploader().single("image"), bodyValidator(BannerDTO), bannerCtrl.updateBannerById);

module.exports = bannerRouter;