const checkLogin = require("../../middlewares/auth.middleware");
const chatCtrl = require("./chat.controller");

const chatRouter = require("express").Router();

chatRouter.get("/list-users", checkLogin(), chatCtrl.listAllUsers);

module.exports = chatRouter;