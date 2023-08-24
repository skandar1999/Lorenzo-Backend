const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  prix: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },

  categorie: {
    type: String,
    required: true
  },
 
  image: {
    type: String,
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
 