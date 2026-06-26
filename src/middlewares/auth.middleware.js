// This middleware helps to checkLogin of users i.e. Seller, Customer, Admin

const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/app.config");
const userService = require("../modules/user/user.service");
const { UserRoles } = require("../config/constants");

const checkLogin = (role = null) => {
  return async (req, res, next) => {
    try {
      let token = req.headers["authorization"] ?? null;
      if(!token) {
        throw {
          code: 401,
          message: "Missing Access Token",
          status: "MISSING_ACCESS_TOKEN_ERR",
        }
      }
      token = token.replace("Bearer ", "");
      const data = jwt.verify(token, AppConfig.jwtSecret);

      const userDetail = await userService.getSingleUserByFilter({
        _id: data.sub,
      });

      if(!userDetail) {
        throw {
          code: 403,
          message: "User Not Found",
          status: "USER_NOT_FOUND",
        };
      };

      // getting loggedInUser
      req.loggedInUser = userService.getPublicProfileOfUser(userDetail);

      if(userDetail.role === UserRoles.ADMIN || role === null || (Array.isArray(role) && role.includes(userDetail.role))) {
        next();
      } else {
        next({
          code: 403,
          message: "User Access Denied",
          status: "UNAUTHORIZED",
        })
      }
    } catch (exception) {
      let errorBag = {
        code: 401,
        message: exception.message,
        status: "AUTH_ERR",
      }
      next(errorBag);
    }
  } 
}

module.exports = checkLogin;