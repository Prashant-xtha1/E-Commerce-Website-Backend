const slugify = require("slugify");
const cloudinaryService = require("../../services/cloudinary.service");
const ProductModel = require("./product.model");

class ProductService {

  async transformToProduct(req) {
    try {
      const data = req.body;

      data.slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
        remove: /[*+~.()'"!:@]/g,
      });

      data.price = data.price * 100;
      data.afterDiscount = data.price - (data.price * data.discount) / 100;

      if(!data.category || data.category === "null") {
        data.category = null;
      }

      if(!data.brand || data.brand === "null") {
        data.brand = null;
      }

      if(!data.seller || data.seller === "null") {
        data.seller = req.loggedInUser._id;
      }

      data.createdBy = req.loggedInUser._id;

      // Storing Images
      if(req.files) {
        let images = [];
        req.files.map((image) => {
          images.push(cloudinaryService.singleFileUpload(image.path, "/products"));
        })
        const result = await Promise.allSettled(images);
        data.images = [];
        result.forEach((res) => {
          if(res.status === "fulfilled") {
            data.images.push(res.value);
          }
        })
      }

      return data;

    } catch (exception) {
      throw exception;
    }
  }

  async storeProduct(data) {
    try {
      const product = new ProductModel(data);
      return await product.save();
    } catch (exception) {
      throw exception;
    }
  }

}

const productService = new ProductService();
module.exports = productService;