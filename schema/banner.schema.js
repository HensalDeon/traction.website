const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  imageURL: {
    type: String,
    required: true,
    trim: true,
  },
  bannerNumber: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  // startDate: {
  //   type: Date,
  //   required: true,
  // },
  // endDate: {
  //   type: Date,
  //   required: true,
  // },
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
