const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 200,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 100,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 95,
  },
  afterDiscount: {
    type: Number,
    required: true,
  },
  category: [{
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  }],
  brand: {
    type: mongoose.Types.ObjectId,
    ref: "Brand",
    default: null,
  },
  description: {
    type: String,
    minLength: 10,
    default: null,
  },
  stock: {
    type: Number,
    min: 0,
    default: 0,
  },
  sku: String,
  attributes: [{
    key: String,
    value: [String],
  }],
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
  autoCreate: true,
  autoIndex: true,
})

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;