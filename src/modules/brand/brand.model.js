const mongoose = require("mongoose");
const { Status } = require("../../config/constants");

const BrandSchema = new mongoose.Schema({
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
  logo: {
    publicId: String,
    url: String,
    optimizedUrl: String,
  },
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
}, {
  timestamps: true,
  autoCreate: true,
  autoIndex: true,
})

const BrandModel = mongoose.model("Brand", BrandSchema);
module.exports = BrandModel;