const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
    {
      // reviewerName: {
      //   type: String,
      //   required: true,
      // },
      // reviewerImage: {
      //   type: String,
      // },
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
    { timestamps: true },
  );

  
  module.exports = mongoose.model('Review', reviewSchema);