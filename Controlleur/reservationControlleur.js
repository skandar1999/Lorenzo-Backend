const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const User = require('../models/user');
const Reservation = require('../models/Reservation'); 


router.post('/reserveproducts', async (req, res) => {
    try {
        const productIds = req.body.productIds;
        const userData = req.body.userData;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).send('Invalid product IDs');
        }

        // Find products by IDs
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(404).send('One or more products not found');
        }

        // Map products to reservations
        const reservations = productIds.map((productId) => ({
            productId: productId,
            userName: userData.userName,
            userLastName: userData.userLastName,
            UserTelephone: userData.UserTelephone,
            UserRegion: userData.UserRegion,
            isConfirmed: false,
            isCompleted: false,
        }));

        // Update products to set 'disponible' to false
        await Product.updateMany(
            { _id: { $in: productIds } }, // Filter by product IDs
            { $set: { disponible: false } } // Set 'disponible' to false
        );

        // Insert the reservations into the database
        await Reservation.insertMany(reservations);

        res.status(200).json({ message: 'Products reserved successfully and availability updated' });
    } catch (error) {
        console.error('Error reserving products:', error);
        res.status(500).send('Error reserving products');
    }
});


// Route to delete a reservation
router.delete('/deletereservation/:reservationId', async (req, res) => {
    try {
        const reservationId = req.params.reservationId;

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).send('Reservation not found');
        }

        await Reservation.deleteOne({ _id: reservationId });

        res.status(200).send('Reservation deleted successfully');
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).send('Error deleting reservation');
    }
});

// Route to display all reservations
router.get('/allCommande', async (req, res) => {
    try {
        const reservations = await Reservation.find(); 
        res.status(200).json(reservations); 
    } catch (error) {
        console.error('Error retrieving reservations:', error);
        res.status(500).json({ error: 'An error occurred while retrieving reservations' });
    }
});

router.put('/updateReservation/:id', async (req, res) => {
    const { isConfirmed, isCompleted } = req.body; 

    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { isConfirmed, isCompleted },
            { new: true } // Return the updated document
        );

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(200).json(reservation); // Return the updated reservation
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({ error: 'An error occurred while updating the reservation' });
    }
});


router.put('/confirmCommande/:id', async (req, res) => {
    try {
      const commandeId = req.params.id;
      const updatedCommande = await Reservation.findByIdAndUpdate(
        commandeId,
        { isConfirmed: true }, 
        { new: true }
      );
      res.status(200).json(updatedCommande);
    } catch (error) {
      console.error('Error confirming commande:', error);
      res.status(500).json({ error: 'An error occurred while confirming the commande' });
    }
  });


  router.put('/completeCommande/:id', async (req, res) => {
    try {
      const commandeId = req.params.id;
      const updatedCommande = await Reservation.findByIdAndUpdate(
        commandeId,
        { isCompleted: true }, 
        { new: true }
      );
      res.status(200).json(updatedCommande);
    } catch (error) {
      console.error('Error completing commande:', error);
      res.status(500).json({ error: 'An error occurred while completing the commande' });
      
    }
  });



  router.get("/countReservation", async (req, res) => {
    try {
      const Count = await Reservation.countDocuments({});
      res.json({ Count });
    } catch (error) {
      console.error("Error counting Reservation:", error);
      res.status(500).json({ error: "Error counting Reservation" });
    }
  });
  
  
module.exports = router;
