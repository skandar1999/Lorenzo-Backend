const express = require('express');
const router = express.Router(); // Change 'routeur' to 'router'

const Product = require('../models/product');
const User = require('../models/user');
const Reservation = require('../models/Reservation'); // Import the Reservation model



router.post('/reserveproduct/:productId', async (req, res) => {
    try {
      const productId = req.params.productId; // Fix the parameter name
      const userId = req.body.userId; // Fix the request body property name
  
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const reservation = new Reservation({
        userId: user._id,
        productId: product._id,
      });
  
      await reservation.save();
  
      res.status(200).send('Product reserved successfully');
    } catch (error) {
      console.error('Error reserving product:', error);
      res.status(500).send('Error reserving product');
    }
  });

router.delete('/deletereservation/:reservationId', async (req, res) => {
    try {
        const reservationId = req.params.reservationId;

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).send('Reservation not found');
        }

        await Reservation.deleteOne({ _id: reservationId }); // Delete the reservation

        res.status(200).send('Reservation deleted successfully');
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).send('Error deleting reservation');
    }
});

module.exports = router;
