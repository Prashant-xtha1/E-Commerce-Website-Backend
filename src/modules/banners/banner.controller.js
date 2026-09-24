const bannerService = require("./banner.service");
const { Op } = require("sequelize");

class BannerController {
  async createBanner (req, res, next) {
    try {
      const data = await bannerService.transformToBannerCreate(req);
      const banner = await bannerService.storeBanner(data);

      res.json({
        data: banner,
        message: "Your banner created successfully",
        status: "SUCCESS"
      })
    } catch (exception) {
      next(exception);
    }
  }

  async listBanner (req, res, next) {
    try {
      let filter = {};

      if(req.query.q) {
        filter = {
          title: {[Op.iLike]: `%${req.query.q}%`}
        }
      };

      if(req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        }
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      };

      const {data, pagination} = await bannerService.getAllRowsByFilter(filter, config);

      res.json({
        data: data,
        message: "Your Banner List",
        status: "SUCCESS",
        meta: {
          pagination
        }
      })

    } catch (exception) {
      next(exception);
    }
  }

  async getBannerDetailById (req, res, next) {
    try {
      let filter = {
        _id: req.params.bannerId
      }

      const data = await bannerService.getSingleRowByFilter(filter);
      console.log(data);

      if(!data) {
        throw {
          code: 404,
          message: "Banner not found",
          status: "BANNER_NOT_FOUND",
        }
      }

      res.json({
        data: data,
        message: "Banner detail by id",
        status: "SUCCESS",
      })

    } catch (exception) {
      next(exception);
    }
  }

  async updateBannerById (req, res, next) {
    try {
      let filter = {
        _id: req.params.bannerId
      }

      const banner = await bannerService.getSingleRowByFilter(filter);

      if(!banner) {
        throw {
          code: 404,
          message: "Banner not found",
          status: "BANNER_NOT_FOUND",
        }
      }

      let updateData = await bannerService.transformToBannerUpdate(req, banner);
      updateData = await bannerService.updateSingleRowByFilter(filter, updateData)

      res.json({
        data: updateData,
        message: "Banner Updated Successfully",
        status: "SUCCESS",
      })
    } catch (exception) {
      next(exception);
    }
  }
}

const bannerCtrl = new BannerController();
module.exports = bannerCtrl;