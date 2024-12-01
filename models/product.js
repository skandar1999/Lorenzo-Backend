const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true,
  },

  promoprix: {
    type: Number,
    required: false,
  },

  description: {
    type: String,
    required: true
  },

  categorie: {
    type: String,
    required: true
  },

  promotion: {
    type: Boolean,
    required: true
  },

  image: {
    type: String,
  },

  disponible: {
    type: Boolean,
    default: true 

  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
 