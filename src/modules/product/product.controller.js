const { UserRoles } = require("../../config/constants");
const productService = require("./product.service");

class ProductController {

  async createProduct(req, res, next) {
    try {
      const data = await productService.transformToProduct(req);
      const product = await productService.storeProduct(data);

      res.json({
        data: product,
        message: "Product Created Successfully",
        status: "SUCCESS",
      })
    } catch (exception) {
      next(exception);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      let filter = {};

      if(req.loggedInUser !== UserRoles.ADMIN){
        filter = {
          createdBy: req.loggedInUser._id;
        }
      }

      // search
      if(req.quer)

      const data = await productService.getAllRowsByFilter()
    } catch (exception) {
      next(exception);
    }
  }
}

const productCtrl = new ProductController();
module.exports = productCtrl;