const userService = require("../user/user.service");
const ChatModel = require("./chat.model");

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

  async sendMessage (req, res, next) {
    try {
      const data = req.body;
      data.sender = req.loggedInUser._id;

      const chat = new ChatModel(data);
      await chat.save();

      res.json({
        data: chat,
        message: "Message sent successfully",
        status: "SUCCESS",
      });

    } catch (exception) {
      next(exception);
    }
  }

  async getChatDetail (req, res, next) {
    try {
      const userId = req.params.userId;
      const loggedInUser = req.loggedInUser;

      let filter = {
        $or: [
          {sender: loggedInUser._id, receiver: userId},
          {receiver: loggedInUser._id, sender: userId},
        ]
      }

      if(req.query.q) {
        filter = {
          ...filter,
          message: new RegExp(req.query.q, "i")
        }
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      };

      let skip = (config.page - 1) * config.limit;
      const data = await ChatModel.find(filter)
      .populate("sender", ["_id", "name", "email", "role", "image", "status"])
      .populate("receiver", ["_id", "name", "email", "role", "image", "status"])
      .sort({"createdAt": "desc"})
      .skip(skip)
      .limit(config.limit)

      const total = await ChatModel.countDocuments(filter);


      res.json({
        data: data,
        message: "Your Chat Detail",
        status: "OK",
        meta: {
          page: +config.page,
          limit: +config.limit,
          total: total,
          totalNoOfPages: Math.ceil(total / config.limit)
        }
      })

    } catch (exception) {
      next(exception);
    }
  }
}


const chatCtrl = new ChatController();
module.exports = chatCtrl;