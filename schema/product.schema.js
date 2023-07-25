const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productOldPrice: {
      type: Number,
      default: null,
    },
    stocks: {
      type: Number,
      required: true,
    },
    productImageUrls: [
      {
        type: String,
      },
    ],
    productStatus: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    productNumber: { type: Number},
    slug: { type: String },
    productReview:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true,
      },
    ],
    // productRating: {
    //   type: String,
    //   default: 0,
    // }
  },
  { timestamps: true },
);


const autoIncrementPlugin = (schema, options) => {
  const { field = 'productNumber', startAt = 1 } = options;

  schema.pre('save', async function (next) {
    try {
      if (!this[field]) {
        const lastOrder = await this.constructor.findOne({}, field).sort({ [field]: -1 }).exec();
        const newOrderNumber = lastOrder ? lastOrder[field] + 1 : startAt;
        this[field] = newOrderNumber;
      }
      next();
    } catch (error) {
      next(error);
    }
  });
};

productSchema.plugin(autoIncrementPlugin, { field: 'productNumber', startAt: 4000 });


module.exports = mongoose.model('Product', productSchema);
