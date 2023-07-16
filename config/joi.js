const Joi = require('joi');

//signup
const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(10).required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().required(),
  otp: Joi.string().required(),
  checkbox: Joi.optional(),
});

//add-product
const addProductSchema = Joi.object({
  productName: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Product title must be a string',
    'string.empty': 'Product title is required',
    'string.min': 'Product title must be at least 2 characters long',
    'string.max': 'Product title cannot exceed 100 characters'
  }),
  productDescription: Joi.string().trim().min(5).max(600).required().messages({
    'string.base': 'description must be a string',
    'string.empty': 'description is required',
    'string.min': 'description must be at least 5 characters long',
    'string.max': 'description cannot exceed 600 characters'
  }),
  productPrice: Joi.number().positive().required().messages({
    'number.base': 'Regular price must be a number',
    'number.positive': 'Regular price must be a positive number',
    'any.required': 'Regular price is required'
  }),
  productOldPrice: Joi.number().positive().required().messages({
    'number.base': 'Old price must be a number',
    'number.positive': 'Old price must be a positive number',
    'any.required': 'Old price is required'
  }),
  stocks: Joi.number().integer().positive().required().messages({
    'number.base': 'Stocks must be a number',
    'number.integer': 'Stocks must be an integer',
    'number.positive': 'Stocks must be a positive number',
    'any.required': 'Stocks is required'
  }),
  productCategory: Joi.string().required().messages({
    'any.required': 'Category is required'
  }),
  featured: Joi.boolean().required().messages({
    'boolean.base': 'Featured must be a boolean',
    'any.required': 'Featured is required',
  }),
  productImage: Joi.array().required().messages({
    'any.required': 'Product image is required'
  })
});

// update-product
const updateProductSchema = Joi.object({
  productName: Joi.string().trim().min(2).max(100).messages({
    'string.base': 'Product title must be a string',
    'string.empty': 'Product title is required',
    'string.min': 'Product title must be at least 2 characters long',
    'string.max': 'Product title cannot exceed 100 characters'
  }),
  productDescription: Joi.string().trim().min(5).max(600).messages({
    'string.base': 'description must be a string',
    'string.empty': 'description is required',
    'string.min': 'description must be at least 5 characters long',
    'string.max': 'description cannot exceed 600 characters'
  }),
  productPrice: Joi.number().positive().messages({
    'number.base': 'Regular price must be a number',
    'number.positive': 'Regular price must be a positive number'
  }),
  productOldPrice: Joi.number().positive().messages({
    'number.base': 'Old price must be a number',
    'number.positive': 'Old price must be a positive number'
  }),
  productCategory: Joi.string().required().messages({
    'any.required': 'Category is required'
  }),
  featured: Joi.boolean().required().messages({
    'boolean.base': 'Featured must be a boolean',
    'any.required': 'Featured is required',
  }),
  stocks: Joi.number().integer().min(0).messages({
    'number.base': 'Stocks must be a number',
    'number.integer': 'Stocks must be an integer',
    'number.min': 'Stocks cannot be negative'
  }),
  productId: Joi.any().optional(),
}).min(1); 


//address
const addressSchema = Joi.object({
  fname: Joi.string().trim().pattern(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/).required(),
  lname: Joi.string().trim().pattern(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/).required(),
  country: Joi.string().trim().required(),
  street_address: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  zipcode: Joi.string().trim().pattern(/^\d+$/).required(),
  phone: Joi.string().trim().length(10).optional(),
  email: Joi.string().trim().email().optional(),
  setAddressAs: Joi.string().trim().required(),
});

const updateUserSchema = Joi.object({
  profileimage: Joi.any().optional(),
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().trim().max(30).optional(),
  npassword: Joi.string().trim().min(6).max(30).allow('').optional(),
  cpassword: Joi.any().valid(Joi.ref('npassword')).allow('').optional(),
});

//reset password
const resetPasswordSchema = Joi.object({
  password: Joi.string().trim().max(30).optional()
})

//add-coupon
const couponValidationSchema = Joi.object({
  couponname: Joi.string().required().trim().min(2).max(100).messages({
    'any.required': 'Coupon Name is required',
    'string.empty': 'Coupon Name cannot be empty',
  }),
  couponDescription: Joi.string().required().trim().min(5).max(300).messages({
    'any.required': 'Coupon Description is required',
    'string.empty': 'Coupon Description cannot be empty',
  }),
  discount: Joi.number().required().min(0).messages({
    'any.required': 'Discount is required',
    'number.base': 'Discount must be a number',
    'number.min': 'Discount cannot be negative',
  }),
  minimumPurchase:Joi.number().required().min(0).messages({
    'any.required': 'Minimum purachase amount is required',
    'number.base': 'Minimum purachase amount must be a number',
    'number.min': 'Minimum purachase amount cannot be negative',
  }),
  validFrom: Joi.date().required().messages({
    'any.required': 'Valid From date is required',
    'date.base': 'Valid From must be a valid date',
  }),
  validUntil: Joi.date().required().messages({
    'any.required': 'Valid Until date is required',
    'date.base': 'Valid Until must be a valid date',
  }),
}).custom((value, helpers) => {
  if (value.validFrom && value.validUntil && value.validFrom >= value.validUntil) {
    return helpers.error('date.startEnd', { message: 'Valid From must be less than Valid Until' });
  }
  return value;
}).messages({
  'date.startEnd': 'Valid From must be less than Valid Until',
});

module.exports = {
  signupSchema,
  addProductSchema,
  addressSchema,
  updateUserSchema,
  updateProductSchema,
  couponValidationSchema,
  resetPasswordSchema
};
