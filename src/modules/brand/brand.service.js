const cloudinaryService = require("../../services/cloudinary.service");
const slugify = require("slugify");
const BrandModel = require("./brand.model");

class BrandService {
  async transformToBrandCreate(req) {
    try {
      const data = req.body;
      // slug generation
      data.slug = slugify(data.name, {
        lower: true,
        trim: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      })

      if(req.file) {
        data.logo = await cloudinaryService.singleFileUpload(req.file.path, '/brand');
      }

      data.createdBy = req.loggedInUser._id;

      return data;
    } catch (exception) {
      throw exception
    }
  }

  async storeBrand(data) {
    try {
      const brand = new BrandModel(data);
      return await brand.save()
    } catch (exception) {
      throw exception;
    }
  }
}

const brandService = new BrandService();
module.exports = brandService;