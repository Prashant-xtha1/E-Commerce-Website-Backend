const { required } = require("joi");
const mongoose = require("mongoose");
const { UserRoles, Status } = require("../../config/constants");

const UserSchema = new mongoose.Schema(
  {
    // Model Definition
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.CUSTOMER
    },
    image: {
      publicId: String,
      url: String,
      optimizedUrl: String,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },
    phone: String,
    address: String,
    token: String,
    emailVerifiedAt: Date,
    expiryTime: Date,
  },
  {
    // options
    timestamps: true, //Generate createdAt and updatedAt
    autoCreate: true,
    autoIndex: true,
    
  }
)

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;