// backend/models/chatModel.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  messages: [messageSchema]
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
