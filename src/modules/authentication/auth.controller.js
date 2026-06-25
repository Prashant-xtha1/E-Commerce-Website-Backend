const { AppConfig } = require("../../config/app.config");
const { Status, UserRoles } = require("../../config/constants");
const { generateRandomString } = require("../../utilities/helper");
const userService = require("../user/user.service");
const authService = require("./auth.service");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  registerUser = async (req, res, next) => {
    try {
      // Transforming user data
      const data = await authService.tranformForUser(req);

      // Database save
      const user = await userService.storeUser(data);

      // notifying user
      let meta = {};
      if (AppConfig.environment === "local") {
        await authService.sendAccountActivationNotificationEmail(user);
      } else {
        meta = {
          activationLink: `${AppConfig.feUrl}/activate/${user.token}`,
        };
      }

      res.json({
        data: userService.getPublicProfileOfUser(user),
        message: "Registration Successful",
        status: "OK",
        meta: meta,
      });
    } catch (exception) {
      next(exception);
    }
  };

  activateUser = async (req, res, next) => {
    try {
      const token = req.params.token;
      let user = await userService.getSingleUserByFilter({
        token: token,
      });
      if (!user) {
        throw {
          code: 404,
          message: "Token not found",
          status: "TOKEN_NOT_FOUND_ERR",
        };
      }

      const today = Date.now();
      const expiryTime = user.expiryTime.getTime();

      if (today > expiryTime) {
        throw {
          code: 422,
          message: "Activation token expired",
          status: "TOKEN_EXPIRED_ERR",
        };
      }

      user = await userService.updateSingleRowByFilter(
        { _id: user._id },
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
      });
    } catch (exception) {
      next(exception);
    }
  };

  resendActivationToken = async (req, res, next) => {
    try {
      const token = req.params.token;
      let user = await userService.getSingleUserByFilter({
        token: token,
      });
      if (!user) {
        throw {
          code: 404,
          message: "Token not found",
          status: "TOKEN_NOT_FOUND_ERR",
        };
      }

      const today = Date.now();
      const expiryTime = user.expiryTime.getTime();

      if (today < expiryTime) {
        throw {
          code: 422,
          message: "Token not expired",
          status: "TOKEN_NOT_EXPIRED_ERR",
        };
      }

      const data = {
        token: generateRandomString(),
        expiryTime: Date.now() + 86400000,
      };

      let userDetail = await userService.updateSingleRowByFilter(
        { _id: user._id },
        data,
      );

      // notifying user
      let meta = {};
      if (AppConfig.environment === "local") {
        await authService.resendAccountActivationNotificationEmail(userDetail);
      } else {
        meta = {
          activationLink: `${AppConfig.feUrl}/activate/${userDetail.token}`,
        };
      }

      res.json({
        data: userService.getPublicProfileOfUser(user),
        message: "Account re-activation link sent to email",
        status: "REACTIVATION_LINK_SENT",
      });
    } catch (exception) {
      next(exception);
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userDetail = await userService.getSingleUserByFilter({
        email: email,
      });

      if (!userDetail) {
        throw {
          code: 404,
          message: "User not registerd yet",
          status: "USER_NOT_REGISTERED",
        };
      }

      // checking user activate or not
      if (userDetail.status !== Status.ACTIVE || userDetail.token) {
        throw {
          code: 422,
          message: "User not activated",
          status: "USER_NOT_ACTIVATED",
        };
      }

      // password verification
      if (!bycrpt.compareSync(password, userDetail.password)) {
        throw {
          code: 422,
          message: "Credentials doesnot match",
          status: "INVALID_CREDENTIALS",
        };
      }

      // generating JWT token
      let authToken = jwt.sign({sub: userDetail._id}, AppConfig.jwtSecret, {expiresIn: "1d"});

      res.json({
        data: authToken,
        message: "Login Success",
        status: "LOGIN_SUCCESS",
      });
    } catch (exception) {
      next(exception);
    }
  };

  getLoggedInUser = (req, res, next) => {
    res.json({
      message: "I am logged in user",
    });
    // next();
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
