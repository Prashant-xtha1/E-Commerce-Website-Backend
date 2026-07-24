const cloudinaryService = require("../../services/cloudinary.service");
const slugify = require("slugify");
const CategoryModel = require("./category.model");

class CategoryService {
  async transformToCategoryCreate(req) {
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
        data.image = await cloudinaryService.singleFileUpload(req.file.path, '/category');
      }

      if(!data.parentId || data.parentId === "null"){
        parentId = null;
      }

      if(!data.brandId || data.brandId === "null"){
        brandId = null;
      }

      data.createdBy = req.loggedInUser._id;

      return data;
    } catch (exception) {
      throw exception
    }
  }

  async transformToCategoryUpdate(req, category) {
    try {
      const data = req.body;

      if(req.file) {
        data.logo = await cloudinaryService.singleFileUpload(req.file.path, '/category');
      } else {
        data.logo = category.logo
      }

      data.updatedBy = req.loggedInUser._id;
      return data;
    } catch (exception) {
      throw exception
    }
  }

  async storeCategory(data) {
    try {
      const category = new CategoryModel(data);
      return await category.save()
    } catch (exception) {
      throw exception;
    }
  }

  async getAllRowsByFilter(filter, config={page: 1, limit: 20}) {
    try {
      const page = +config.page || 1;
      const limit = +config.limit || 20;

      // Pagination
      const skip = (page - 1) * limit;
      const data = await CategoryModel.find(filter)
      .populate("createdBy", ["_id", "name", "email", "role", "image", "status"])
      .populate("updatedBy", ["_id", "name", "email", "role", "image", "status"])
      .sort({"createdAt": "desc"})
      .skip(skip)
      .limit(limit)

      const total = await CategoryModel.countDocuments(filter);
      return {data, pagination: {page, limit: limit, total: total}}
    } catch (exception) {
      throw exception;
    }
  }

  async getSingleRowByFilter(filter) {
    try {
      const data = await CategoryModel.findOne(filter)
      .populate("createdBy", ["_id", "name", "email", "role", "image", "status"])
      .populate("updatedBy", ["_id", "name", "email", "role", "image", "status"])

      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async updateSingleRowByFilter(filter, data) {
    try {
      const updateResponse = await CategoryModel.findOneAndUpdate(filter, {$set: data}, {new: true})
      return updateResponse;
    } catch (exception) {
      throw exception;
    }
  }

  async deleteSingleRowByFilter(filter) {
    try {
      const del = await CategoryModel.findOneAndDelete(filter);
      return del; 
    } catch (exception) {
      throw exception;
    }
  }
}

const categoryService = new CategoryService();
module.exports = categoryService;