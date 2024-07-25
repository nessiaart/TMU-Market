const mongoose = require('mongoose');

//schema for each message, should have Id of which chat its in, sender id and the actual message
//keep timestamps for rendering in order**
const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Create the model 
const MessageModel = mongoose.model("message", MessageSchema);
module.exports = MessageModel; 
