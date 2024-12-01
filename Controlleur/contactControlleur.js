const express = require("express");
const router = express.Router();
const Contact = require('../models/contact');

router.post("/sendMessage", async (req, res) => {
  try {
    const data = req.body;

    // Create a new message with the provided data
    const newMessage = new Contact({
      email: data.email,
      phone: data.phone,
      text: data.text,
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage); 
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
