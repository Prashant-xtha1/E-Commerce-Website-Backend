require("dotenv").config();

const CloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}

const DbConfig = {
  mongodb: {
    url: process.env.MONGODB_URL,
    dbname: process.env.MONGODB_DBNAME,
  }
}

module.exports = {
  CloudinaryConfig,
  DbConfig
}