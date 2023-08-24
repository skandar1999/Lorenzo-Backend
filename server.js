const express = require('express');
const app = express();
require('./config/connect');

const cors = require('cors');
const bodyParser = require('body-parser'); // Add body-parser
const path = require('path');


// Use cors middleware with specific configuration
app.use(cors({
  origin: 'http://localhost:4200', // Allow requests from this origin
  methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
  optionsSuccessStatus: 204 // Set the status code for successful preflight OPTIONS requests
}));

// Serve static files (images) from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json()); // Use bodyParser middleware


const product = require('./Controlleur/productControlleur');
const user = require('./Controlleur/userControlleur');
const reservation = require('./Controlleur/reservationControlleur');

app.use('/product', product);
app.use('/user', user);
app.use('/reservation', reservation);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
