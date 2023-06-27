const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  street_address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isShippingAddress: {
    type: Boolean,
    default: false,
  },
  isBillingAddress: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Address', addressSchema);
