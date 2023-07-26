const reviewDatabase = require("../schema/review.schema")

async function fetchReviews(reviewReferences){
    try {
        const reviews = await reviewDatabase.find({ _id: { $in: reviewReferences } }).populate('reviewer');
        
        if (reviews) {
          return reviews;
        } else {
          return [];
        }
      } catch (error) {
        throw new Error("Something went wrong");
      }
}

module.exports = { fetchReviews }