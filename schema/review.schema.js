const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
    {
      reviewerName: {
        type: String,
        required: true,
      },
      reviewText: {
        type: String,
        required: true,
      },
      reviewDate: {
        type: Date,
        default: Date.now,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    { timestamps: true },
  );

  
  module.exports = mongoose.model('Review', reviewSchema);