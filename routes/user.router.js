const express = require('express');
const userRouter = express.Router();

// const upload = require('../config/multer');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth.handler');

const {
  GetHome,
  GetSignup,
  GetLogin,
  PostLoginVerify,
  GetOtpLogin,
  LoginVerifyPhone,
  GetOtpVerify,
  PostVerifyOtp,
  SignupOtpVerify,
  PostSignup,
  GetAccount,
  // UpdateUserdata,
  GetLogout,
  Get404,
} = require('../controllers/user.controller');

const {
  GetProduct,
  GetAllProducts,
  CategoryProduct,
  ProductsBySearch, 
  SearchResult,
  GetProductImages,
} = require('../controllers/product.controller');

// User Login/Home
userRouter.get('/', GetHome);
userRouter.get('/login', isLoggedOut, GetLogin);
userRouter.post('/login', PostLoginVerify);
userRouter.get('/otp-login', isLoggedOut, GetOtpLogin);
userRouter.post('/otp-login', LoginVerifyPhone);
userRouter.get('/otp-verify', isLoggedOut, GetOtpVerify);
userRouter.post('/otp-verify', isLoggedOut, PostVerifyOtp);

// User SignUp
userRouter.get('/signup', isLoggedOut, GetSignup);
userRouter.post('/signup', isLoggedOut, PostSignup);
userRouter.post('/signup-otp', isLoggedOut, SignupOtpVerify);

// Product/Catogery List
userRouter.get('/product/:slug', GetProduct);
userRouter.get('/shop', GetAllProducts);
userRouter.get('/shop/:id', CategoryProduct);
userRouter.get('/product/images/:id', GetProductImages);

// Product Search
userRouter.get('/search', SearchResult);
userRouter.post('/search-products', ProductsBySearch);

// Accnt details/LogOut
userRouter.get('/account', isLoggedIn, GetAccount);
userRouter.get('/logout', GetLogout);
userRouter.get('/*', Get404);

module.exports = userRouter;