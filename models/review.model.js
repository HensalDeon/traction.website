const reviewDatabase = require("../schema/review.schema")

async function fetchReviews(reviewReferences){
    try {
        const reviews = await reviewDatabase.find({ _id: { $in: reviewReferences } })
        // const existingReview = await reviewDatabase.findOne({
        //     reviewerName: reviewerName,
        //     product: productResult.product._id,
        //   });
      
        //   if (existingReview) {
        //     return res.status(403).json({ success: false, message: 'You have already reviewed this product.' });
        //   }
        if(reviews){
            return reviews
        }else{
            return [];
        }
    } catch (error) {
        throw new Error("Someting went wrong")
    }
}

module.exports = { fetchReviews }