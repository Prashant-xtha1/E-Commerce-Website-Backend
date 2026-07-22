const mongoose = require("mongoose");
const { Status } = require("../../config/constants");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 100,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },
    image: {
      publicId: String,
      url: String,
      optimizedUrl: String,
    },
    parentId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    brandId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
        default: null,
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  },
);

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
