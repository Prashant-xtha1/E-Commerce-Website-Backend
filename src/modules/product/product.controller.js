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

      if(req.loggedInUser.role !== UserRoles.ADMIN){
        filter = {
          createdBy: req.loggedInUser._id
        }
      }

      // search
      if(req.query.search) {
        filter = {
          ...filter,
          $or: [
            {name: new RegExp(req.query.search, "i")},
            {description: new RegExp(req.query.search, "i")}
          ]
        }
      }

      // filter by status
      if(req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        }
      }

      // pagination
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 20;

      const {data, pagination} = await productService.getAllRowsByFilter(filter, {page: page, limit: limit});

      res.json({
        data: data,
        message: "Product fetched successfully",
        status: "SUCCESS",
        meta: {
          pagination
        }
      })
    } catch (exception) {
      next(exception);
    }
  }
}

const productCtrl = new ProductController();
module.exports = productCtrl;