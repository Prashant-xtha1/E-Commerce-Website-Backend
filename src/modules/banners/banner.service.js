const cloudinaryService = require("../../services/cloudinary.service");
const BannerModel = require("./banner.model");

class BannerService {
  async transformToBannerCreate(req) {
    try {
      const data = req.body;
      data.createdBy = JSON.stringify(req.loggedInUser._id);

      if(!req.file) {
        throw {
          code: 400,
          message: "Validation Failed",
          detail: {image: "Image Missing"},
          status: "VALIDATION_ERR",
        }
      }

      data.image = await cloudinaryService.singleFileUpload(req.file.path, "/banners");

      return data;

    } catch (exception) {
      throw exception;
    }
  }

  async storeBanner(data) {
    try {
      const banner = await BannerModel.create(data);
      return banner;
    } catch (exception) {
      throw exception;
    }
  }

  async getAllRowsByFilter(filter, {page, limit}) {
    try {
      const skip = (page - 1) * limit;
      const {rows, count} = await BannerModel.findAndCountAll({
        where: filter,
        order: [["createdAt", "desc"]],
        limit: limit,
        offset: skip
      });

      return {
        data: rows,
        pagination: {
          total: +count,
          page: +page,
          limit: +limit,
          totalNoOfPages: Math.ceil(count/limit)
        }
      }

    } catch (exception) {
      throw exception;
    }
  }

  async getSingleRowByFilter(filter) {
    try {
      const data = await BannerModel.findOne({
        where: filter,
      });

      return data;

    } catch (exception) {
      throw exception
    }
  }
}

const bannerService = new BannerService();
module.exports = bannerService;