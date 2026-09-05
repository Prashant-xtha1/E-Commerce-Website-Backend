const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const chatCtrl = require("./chat.controller");
const { SendChatDTO } = require("./chat.validator");

const chatRouter = require("express").Router();

chatRouter.get("/list-users", checkLogin(), chatCtrl.listAllUsers);
chatRouter.post("/send-message", checkLogin(), bodyValidator(SendChatDTO), chatCtrl.sendMessage);

module.exports = chatRouter;