const cloudinaryService = require("../../services/cloudinary.service");
const bycrpt = require("bcryptjs");
const { generateRandomString } = require("../../utilities/helper");

class AuthService {
  async tranformForUser(req) {
    try {
      const data = req.body;
      data.password = bcrypt.hashSync(data.password, 12);
      if(req.file) {
        data.image = await cloudinaryService.singleFileUpload(req.file.path, "/users");
      }
      
      // Token creation
      data.token = generateRandomString();
      data.expiryTime = Date.now() + 86400000;

      return data;
    } catch (exception) {
      throw exception;
    }
  }
}

const authService = new AuthService();
module.exports = authService;