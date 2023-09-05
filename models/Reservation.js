const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },


  userName: {
    type: String,
  },

  userLastName: {
    type: String,
  },

  UserTelephone: {
    type: String,
  },

  UserRegion: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
