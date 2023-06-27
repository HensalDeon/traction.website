const express = require('express');
const userRouter = express.Router();

const upload = require('../config/multer');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth.handler');

const {
  httpGetHome,
  httpGetSignup,
  httpGetLogin,
  httpPostLoginVerify,
  httpGetOtpLogin,
  httpLoginVerifyPhone,
  httpGetOtpVerify,
  httpPostVerifyOtp,
  httpSignupOtpVerify,
  httpPostSignup,
//   httpGetAccount,
//   httpUpdateUserdata,
  httpGetLogout,
  httpGet404,
} = require('../controllers/user.controller');

userRouter.get('/', httpGetHome);
userRouter.get('/login', isLoggedOut, httpGetLogin);
userRouter.post('/login', httpPostLoginVerify);
userRouter.get('/otp-login', isLoggedOut, httpGetOtpLogin);
userRouter.post('/otp-login', httpLoginVerifyPhone);
userRouter.get('/otp-verify', isLoggedOut, httpGetOtpVerify);
userRouter.post('/otp-verify', isLoggedOut, httpPostVerifyOtp);

userRouter.get('/signup', isLoggedOut, httpGetSignup);
userRouter.post('/signup', isLoggedOut, httpPostSignup);
userRouter.post('/signup-otp', isLoggedOut, httpSignupOtpVerify);

// userRouter.get('/product/:slug', httpGetProduct);
// userRouter.get('/shop', httpGetAllProducts);
// userRouter.get('/shop/:id', httpCategoryProduct);

// userRouter.get('/cart', isLoggedIn, httpGetCart);
// userRouter.post('/cart', isLoggedIn, httpPostToCart);
// userRouter.delete('/cart', isLoggedIn, httpRemoveFromCart);
// userRouter.patch('/cart', isLoggedIn, httpUpdateQuantity);
// userRouter.delete('/clear-cart', isLoggedIn, httpClearCart);
userRouter.get('/logout', httpGetLogout);
userRouter.get('/*', httpGet404);

module.exports = userRouter;