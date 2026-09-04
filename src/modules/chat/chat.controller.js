const userService = require("../user/user.service");

class ChatController {
  async listAllUsers (req, res, next) {
    try {
      let filter = {};
      if(req.query) {
        filter = {
          $or: [
            {name: new RegExp(req.query.q, "i")},
            {email: new RegExp(req.query.q, "i")},
            {phone: new RegExp(req.query.q, "i")},
          ]
        }
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      }

      const {data, pagination} = await userService.getAllUsersByFilter(filter, config);

      res.json({
        data: data,
        message: "User List",
        meta: {
          pagination
        }
      })

    } catch (exception) {
      next(exception);
    }
  }
}

const chatCtrl = new ChatController();
module.exports = chatCtrl;