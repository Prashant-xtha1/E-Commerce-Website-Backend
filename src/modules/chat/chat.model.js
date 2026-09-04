const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    minlength: 1,
    maxlength: 5000,
  },
  isSeen: Boolean,
  reaction: [{
    type: String
  }]
}, {
  autoCreate: true,
  autoIndex: true,
  timestamps: true,
})

const ChatModel = mongoose.model("Chat", ChatSchema);
module.exports = ChatModel;