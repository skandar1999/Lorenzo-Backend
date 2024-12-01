const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, 
  },
  phone: {
    type: String,
    required: true, 
  },
  text: {
    type: String,
    required: true, 
    minlength: 1,  
  },
  date: {
    type: Date,
    default: Date.now, 
  },

  seem: {
    type: Boolean,
    default: false 

  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
