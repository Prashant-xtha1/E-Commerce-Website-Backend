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
      
    } catch (exception) {
      next(exception);
    }
  }

  async getDetail(req, res, next) {
    try {
      
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
      
    } catch (exception) {
      next(exception);
    }
  }

  async delete(req, res, next) {
    try {
      
    } catch (exception) {
      next(exception);
    }
  }
}

const brandCtrl = new BrandController();
module.exports = brandCtrl;