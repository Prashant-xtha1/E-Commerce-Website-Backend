const { UserRoles, Status } = require("../../config/constants");
const productService = require("../product/product.service");
const categoryService = require("./category.service");

class CategoryController {
  async create(req, res, next) {
    try {
      const data = await categoryService.transformToCategoryCreate(req);
      const category = await categoryService.storeCategory(data);

      res.json({
        data: category,
        message: "Category Created Successfully",
        status: "CATEGORY_CREATED",
      })
    } catch (exception) {
      next(exception);
    }
  }

  async listAll(req, res, next) {
    try {
      let filter = {};
      if (req.query.search) {
        filter = {
          $or: [{name: new RegExp(req.query.search, "i")}],
        };
      }

      if(req.query.status) {
        filter = {
          ...filter,
          status: req.query.status
        }
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      }

      const {data, pagination} = await categoryService.getAllRowsByFilter(filter, config);
      res.json({
        data: data,
        message: "Category Listing",
        status: "OK",
        meta: {
          pagination,
        }
      })
    } catch (exception) {
      next(exception);
    }
  }

  async getDetail(req, res, next) {
    try {
      const category = await categoryService.getSingleRowByFilter({
        _id: req.params.categoryId,
      });

      if(!category){
        throw {
          code: 404,
          message: "Category not found",
          status: "CATEGORY_NOT_FOUND_ERR",
        }
      }

      res.json({
        data: category,
        message: "Category Detail",
        status: "SUCCESS",
      })
    } catch (exception) {
      next(exception);
    }
  }

  async getDetailBySlug(req, res, next) {
    try {
      const categoryDetail = await categoryService.getSingleRowByFilter({
        slug: req.params.slug
      })

      if(!categoryDetail) {
        throw {
          code: 404,
          message: "Category not found",
          status: "CATEGORY_NOT_FOUND_ERR",
        }
      }

      // Listing all the products related with this category
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 20;
    
      const {data, pagination} = await productService.getAllRowsByFilter({
        category: {$in: [categoryDetail._id]},
        status: Status.ACTIVE
      }, {
        page,
        limit
      })

      res.json({
        data: {
          category: categoryDetail,
          products: data
        },
        message: "Category Detail",
        status: "OK",
        meta: pagination,
      })
    } catch (exception) {
      next(exception);
    }
  }

  async update(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;

      let filter = {
        _id: req.params.categoryId,
      }

      if(loggedInUser !== UserRoles.ADMIN){
        filter = {
          ...filter,
          createdBy: loggedInUser._id,
        }
      }

      const category = await categoryService.getSingleRowByFilter(filter);

      if(!category){
        throw {
          code: 404,
          message: "Category not found",
          status: "CATEGORY_NOT_FOUND_ERR",
        }
      }
      
      const data = await categoryService.transformToCategoryUpdate(req, category);
      const update = await categoryService.updateSingleRowByFilter({_id: category._id}, data)

      res.json({
        data: update, 
        message: "Category Updated Successfully",
        status: "SUCCESS",
      })

    } catch (exception) {
      next(exception);
    }
  }

  async delete(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;

      let filter = {
        _id: req.params.categoryId
      }

      if(loggedInUser.role !== UserRoles.ADMIN){
        filter = {
          ...filter,
          createdBy: loggedInUser._id,
        }
      }

      const category = await categoryService.getSingleRowByFilter(filter);

      if(!category){
        throw {
          code: 404,
          message: "Category not found",
          status: "CATEGORY_NOT_FOUND_ERR",
        }
      }

      const del = await categoryService.deleteSingleRowByFilter(filter);

      res.json({
        data: del,
        message: "Category Deleted Successfully",
        status: "SUCCESS",
      })
    } catch (exception) {
      next(exception);
    }
  }
}

const categoryCtrl = new CategoryController();
module.exports = categoryCtrl;