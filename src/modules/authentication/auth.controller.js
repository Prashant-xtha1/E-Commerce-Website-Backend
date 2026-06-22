const { AppConfig } = require("../../config/app.config");
const { Status } = require("../../config/constants");
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
      let meta = {}
      if(AppConfig.environment === "local"){
        await authService.sendAccountActivationNotificationEmail(user);
      } else {
        meta = {
          activationLink: `${AppConfig.feUrl}/activate/${user.token}`
        }
      }

      res.json({
        data: userService.getPublicProfileOfUser(user),
        message: "Registration Successful",
        status: "OK",
        meta: meta,
      })
    } catch (exception) {
      next(exception);
    }
  }

  activateUser = async (req, res, next) => {
    try {
      const token = req.params.token;
      let user = await userService.getSingleUserByFilter({
        token: token
      });
      if(!user) {
        throw {
          code: 404,
          message: "Token not found",
          status: "TOKEN_NOT_FOUND_ERR",
        }
      }

      const today = Date.now();
      const expiryTime = user.expiryTime.getTime();

      if(today > expiryTime) {
        throw {
          code: 422,
          message: "Activation token expired",
          status: "TOKEN_EXPIRED_ERR",
        }
      }

      user = await userService.updateSingleRowByFilter(
        {_id: user._id},
        {
          status: Status.ACTIVE,
          token: null,
          expiryTime: null,
        },
      );

      res.json({
        data: userService.getPublicProfileOfUser(user),
        message: "Account Activated Successfully",
        status: "SUCCESS",
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