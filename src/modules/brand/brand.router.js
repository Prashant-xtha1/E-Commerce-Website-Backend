const brandCtrl = require("./brand.controller");

const brandRouter = require("express").Router()

brandRouter.get("/:slug/detail", brandCtrl.getDetailBySlug);
brandRouter.get("/", brandCtrl.listAll);

brandRouter.post("/", brandCtrl.create);

brandRouter.get("/:brandId", brandCtrl.getDetail);
brandRouter.put("/:brandId", brandCtrl.update);
brandRouter.delete("/:brandId", brandCtrl.delete);


module.exports = brandRouter;