const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },

  role: {
    type: String,
    default: 'user'
  },

  image: {
    type: String,
    default: 'user.png' // Set a default image filename
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
