const { UserRoles, Status } = require("../../config/constants");
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

  async getProductDetailById (req, res, next) {
    try {
      const filter = {
        _id: req.params.id
      }

      if(req.loggedInUser.role !== UserRoles.ADMIN){
        filter.createdBy = req.loggedInUser._id;
      }

      const product = await productService.getSingleRowByFilter(filter);

      if(!product) {
        throw {
          code: 404,
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        }
      }

      res.json({
        data: product,
        message: "Product fetched by id successfully",
        status: "SUCCESS",
      })
    } catch (exception) {
      next (exception);
    }
  }

  async updateProduct (req, res, next) {
    try {
      let filter = {
        _id: req.params.id
      }

      if(req.loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          ...filter,
          createdBy: req.loggedInUser._id,
        }
      }

      const product = await productService.getSingleRowByFilter(filter);
      
      if(!product) {
        throw {
          code: 404, 
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        }
      }

      const data = await productService.transformToProductUpdate(req, product);
      const updateData = await productService.updateProductByFilter(filter, data);

      res.json({
        data: updateData,
        message: "Product update successfully",
        status: "SUCCESS",
      })

    } catch (exception) {
      next(exception);
    }
  }

  async deleteProduct (req, res, next) {
    try {
      let filter = {
        _id: req.params.id,
      }

      if(req.loggedInUser.role !== UserRoles.SELLER) {
        filter = {
          ...filter,
          createdBy: req.loggedInUser._id
        }
      }

      const product = await productService.getSingleRowByFilter(filter);

      if(!product) {
        throw {
          code: 404,
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        }
      }

      const deleteData = await productService.deleteSingleRowByFilter(filter);

      res.json({
        data: deleteData,
        message: "Product deleted successfully",
        status: "SUCCESS",
      })

    } catch (exception) {
      next(exception);
    }
  }

  async getProductDetailBySlug (req, res, next) {
    try {
      let filter = {
        slug: req.params.slug,
      }

      const product = await productService.getSingleRowByFilter(filter);

      if(!product) {
        throw {
          code: 404,
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        }
      }

      // Finding related products
      const {data} = await productService.getAllRowsByFilter({
        category: {$in: product.category.map((row) => row._id)},
        status: Status.ACTIVE,
      }, {
        page: 1,
        limit: 8,
      })

      res.json({
        data: {
          product,
          related: data,
        },
        message: "Product fetched successfully",
        status: "SUCCESS",
      })

    } catch (exception) {
      next(exception);
    }
  }
  
}

const productCtrl = new ProductController();
module.exports = productCtrl;