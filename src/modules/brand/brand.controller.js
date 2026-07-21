const { UserRoles } = require("../../config/constants");
const brandService = require("./brand.service");

class BrandController {
  async create(req, res, next) {
    try {
      const data = await brandService.transformToBrandCreate(req);
      const brand = await brandService.storeBrand(data);

      res.json({
        data: brand,
        message: "Brand Created Successfully",
        status: "BRAND_CREATED",
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

      const {data, pagination} = await brandService.getAllRowsByFilter(filter, config);
      res.json({
        data: data,
        message: "Brand Listing",
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
      const brand = await brandService.getSingleRowByFilter({
        _id: req.params.brandId,
      });

      if(!brand){
        throw {
          code: 404,
          message: "Brand not found",
          status: "BRAND_NOT_FOUND_ERR",
        }
      }

      res.json({
        data: brand,
        message: "Brand Detail",
        status: "SUCCESS",
      })
    } catch (exception) {
      next(exception);
    }
  }

  async getDetailBySlug(req, res, next) {
    try {
      
    } catch (exception) {
      next(exception);
    }
  }

  async update(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;

      let filter = {
        _id: req.params.brandId,
      }

      if(loggedInUser !== UserRoles.ADMIN){
        filter = {
          ...filter,
          createdBy: loggedInUser._id,
        }
      }

      const brand = await brandService.getSingleRowByFilter(filter);

      if(!brand){
        throw {
          code: 404,
          message: "Brand not found",
          status: "BRAND_NOT_FOUND_ERR",
        }
      }
      
      const data = await brandService.transformToBrandUpdate(req, brand);
      const update = await brandService.updateSingleRowByFilter({_id: brand._id}, data)

      res.json({
        data: update, 
        message: "Brand Updated Successfully",
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
        _id: req.params.brandId
      }

      if(loggedInUser.role !== UserRoles.ADMIN){
        filter = {
          ...filter,
          createdBy: loggedInUser._id,
        }
      }

      const brand = await brandService.getSingleRowByFilter(filter);

      if(!brand){
        throw {
          code: 404,
          message: "Brand not found",
          status: "BRAND_NOT_FOUND_ERR",
        }
      }

      const del = await brandService.deleteSingleRowByFilter(filter);

      res.json({
        data: del,
        message: "Brand Deleted Successfully",
        status: "SUCCESS",
      })
    } catch (exception) {
      next(exception);
    }
  }
}

const brandCtrl = new BrandController();
module.exports = brandCtrl;