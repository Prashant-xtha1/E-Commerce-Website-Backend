const { CloudinaryConfig } = require("../config/app.config");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

class CloudinaryService {
  // Configuration of cloudinary setup
  constructor() {
    cloudinary.config({
      cloud_name: CloudinaryConfig.cloudName,
      api_key: CloudinaryConfig.apiKey,
      api_secret: CloudinaryConfig.apiSecret,
    });
  }

  async singleFileUpload(filePath, dir="/") {
    try {
      const response = await cloudinary.uploader.upload(filePath, {
        folder: "/e-commerce"+dir,
        unique_filename: true,
      });
      
      const optimize = cloudinary.url(response.public_id, {
        transformation: [
          {quality: "auto", aspect_ratio: "1.0", width: "400", height: "400", crop: "scale"},
          {fetch_format: "auto"}
        ]
      })
      
      fs.unlinkSync(filePath);
      
      return {
        publicId: response.public_id,
        url: response.secure_url,
        optimizedUrl: optimize,
      }
    } catch (exception) {
      // console.error(exception)
      throw{
        code: 500,
        message: "Cloudinary file upload failed",
        status: "CLOUDINARY_FILE_UPLOAD_FAILED", 
      }
    }
  }
}

const cloudinaryService = new CloudinaryService();
module.exports = cloudinaryService;
