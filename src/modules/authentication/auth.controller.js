const userService = require("../user/user.service");
const authService = require("./auth.service");

class AuthController {
  registerUser = async (req, res, next) => {
    try {
      // Transforming user data
      const data = await authService.tranformForUser(req);
      
      // Database save
      const user = await userService.storeUser(data);

      // notifying user 
      await authService.sendAccountActivationNotificationEmail(user);

      res.json({
        data: user,
        message: "Registration Successful",
        status: "OK",
      })
    } catch (exception) {
      next(exception);
    }
  }

  loginUser = (req, res, next) => {
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