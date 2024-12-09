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



router.get("/getAllMessages", async (req, res) => {
  try {
    const messages = await Contact.find(); 
    res.status(200).json(messages); 
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send("Internal server error");
  }
});



router.put('/seemMessage/:id', async (req, res) => {
  try {
    const messageId = req.params.id;

    // Update the 'seem' field to true
    const updatedMessage = await Contact.findByIdAndUpdate(
      messageId,
      { seem: true },
      { new: true } // Return the updated document
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'An error occurred while updating the message' });
  }
});


router.delete("/deleteMessage/:id", (req, res) => {
  const myId = req.params.id;

  Contact.findByIdAndDelete(myId)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.status(200).json({ message: "Contact deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting message:", err);
      res.status(500).json({ error: "Error deleting message" });
    });
});


router.get("/countMessages", async (req, res) => {
  try {
    const Count = await Contact.countDocuments({});
    res.json({ Count });
  } catch (error) {
    console.error("Error counting Messages:", error);
    res.status(500).json({ error: "Error counting Messages" });
  }
});



module.exports = router;
