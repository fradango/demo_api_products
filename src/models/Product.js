const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  sku: {
    type: String,
    required: [true, 'Please add sku'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please add name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please add price'],
  },
  stock: {
    type: Number,
  },
  idWarehouse: {
    type: String,
  },
  status: {
    type: String,
    required: [true, 'Please add status'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Product', productSchema);
