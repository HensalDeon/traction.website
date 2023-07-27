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

async function deleteReview(reviewId, userId){
  try {
    const review = await reviewDatabase.findById(reviewId);
    if (!review || review.reviewer.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }
   await reviewDatabase.findByIdAndDelete(reviewId);
    return { status: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { status: false };
  }
}

module.exports = { fetchReviews, deleteReview }