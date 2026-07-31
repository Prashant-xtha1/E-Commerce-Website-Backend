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

}

const productCtrl = new ProductController();
module.exports = productCtrl;