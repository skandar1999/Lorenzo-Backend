const express = require('express');
const router = express.Router(); // Change 'routeur' to 'router'

const Product = require('../models/product');
const User = require('../models/user');
const Reservation = require('../models/Reservation'); // Import the Reservation model


router.post('/reserveproducts', async (req, res) => {
    try {
        const productIds = req.body.productIds; // Assuming productIds is an array
        const userData = req.body.userData; // Include user details in the request body

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).send('Invalid product IDs');
        }


        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(404).send('One or more products not found');
        }

        // Create reservations with user and product details
        const reservations = productIds.map((productId) => ({
            productId: productId,
            userName: userData.userName,
            userLastName: userData.userLastName,
            UserTelephone: userData.UserTelephone,
            UserRegion: userData.UserRegion,
        }));

        await Reservation.insertMany(reservations);

        res.status(200).json({ message: 'Products reserved successfully' });
    } catch (error) {
        console.error('Error reserving products:', error);
        res.status(500).send('Error reserving products');
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


router.get('/allreservations', async (req, res) => {
    try {
      const reservations = await Reservation.find(); // Find all reservations in the database
      res.status(200).json(reservations); // Send the reservations as a JSON response
    } catch (error) {
      console.error('Error retrieving reservations:', error);
      res.status(500).json({ error: 'An error occurred while retrieving reservations' });
    }
  });

module.exports = router;
