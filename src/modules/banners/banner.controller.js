const bannerService = require("./banner.service");

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
}

const bannerCtrl = new BannerController();
module.exports = bannerCtrl;