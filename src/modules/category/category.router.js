const { UserRoles } = require("../../config/constants");
const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const categoryCtrl = require("./category.controller");
const { CategoryDTO } = require("./category.validator");

const categoryRouter = require("express").Router()

categoryRouter.get("/:slug/detail", categoryCtrl.getDetailBySlug);
categoryRouter.get("/", checkLogin(), categoryCtrl.listAll);

categoryRouter.post("/", checkLogin([UserRoles.SELLER]), uploader().single("logo"), bodyValidator(CategoryDTO), categoryCtrl.create);

categoryRouter.get("/:categoryId", checkLogin(), categoryCtrl.getDetail);
categoryRouter.put("/:categoryId", checkLogin([UserRoles.SELLER]), uploader().single("logo"), categoryCtrl.update);
categoryRouter.delete("/:categoryId", checkLogin([UserRoles.SELLER]), categoryCtrl.delete);


module.exports = categoryRouter;