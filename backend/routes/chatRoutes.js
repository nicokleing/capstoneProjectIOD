const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Endpoint to save messages
router.post('/save-messages', async (req, res) => {
  try {
    const messages = req.body.messages;
    await Message.insertMany(messages);
    res.status(200).send('Messages saved successfully');
  } catch (error) {
    res.status(500).send('Error saving messages');
  }
});

module.exports = router;
