const express = require('express');
const app = express();
require('./config/connect');

const cors = require('cors');
const bodyParser = require('body-parser'); 
const path = require('path');

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: 'GET,POST,PUT,DELETE', 
  optionsSuccessStatus: 204 
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json()); 


const product = require('./Controlleur/productControlleur');
const user = require('./Controlleur/userControlleur');
const reservation = require('./Controlleur/reservationControlleur');
const contact = require('./Controlleur/contactControlleur');

app.use('/product', product);
app.use('/user', user);
app.use('/reservation', reservation);
app.use('/contact', contact);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
