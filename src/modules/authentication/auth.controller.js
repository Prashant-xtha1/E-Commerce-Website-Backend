const cloudinaryService = require("../../services/cloudinary.service");

class AuthController {
  registerUser = async (req, res, next) => {
    try {
      const data = req.body;
      data.image = await cloudinaryService.singleFileUpload(req.file.path, "/users");

      res.json({
        data: data,
        message: "Registration Successful",
        status: "OK",
      })
    } catch (exception) {
      next(exception);
    }
  }

  loginUser = (req, res) => {
  res.json({
    data: {},
    message: "Login Success by Prashant",
    status: "OK",
  })
}

  getLoggedInUser = (req, res, next) => {
    res.json({
      message: "I am logged in user"
    })
    // next();
  }
}

const authCtrl = new AuthController();
module.exports = authCtrl;