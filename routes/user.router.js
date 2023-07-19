const express = require('express');
const userRouter = express.Router();

const upload = require('../config/multer');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth.handler');

const { GetAbout, GetContact, GetLearnMore } = require('../controllers/page.controller')

const {
  GetHome,
  GetSignup,
  GetLogin,
  PostLoginVerify,
  GetOtpLogin,
  LoginVerifyPhone,
  VerifyPhone,
  GetOtpVerify,
  PostVerifyOtp,
  VerifyOtp,
  SignupOtpVerify,
  PostSignup,
  GetAccount,
  UpdateUserdata,
  GetLogout,
  Get404,
  GetForgotPassword,
  PostResetPassword,
  GetInvoice
} = require('../controllers/user.controller');

const {
  GetProduct,
  GetAllProducts,
  CategoryProduct,
  ProductsBySearch,
  GetProductImages,
} = require('../controllers/product.controller');

const {
  GetCart,
  PostToCart,
  RemoveFromCart,
  UpdateQuantity,
  ClearCart,
} = require('../controllers/cart.controller');

const {
  GetCheckout,
  PostCheckout,
  AddAddress,
  EditAddress,
  UpdateAddress,
  VerifyPayment,
  SuccessPage,
  FailedPage,
  CancelOrder,
  ReturnOrder,
  DeleteAddress,
  GetWallet,
  ApplyWallet,
  GetOrderDetails,
} = require('../controllers/order.controller');

const { Applycoupon, RemoveCoupon } = require('../controllers/coupon.controller');
const { handleError } = require('../middlewares/error.handler');

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

// forgot password
userRouter.get('/forgot-password', GetForgotPassword);
userRouter.post('/forgot-password/otp', VerifyPhone);
userRouter.post('/forgot-password/otp-verify', VerifyOtp);
userRouter.post('/reset-password', PostResetPassword);

// Product/Catogery List
userRouter.get('/product/:slug', GetProduct);
userRouter.get('/shop', GetAllProducts);
userRouter.get('/shop/:id', CategoryProduct);
userRouter.get('/product/images/:id', GetProductImages);

//cart
userRouter.get('/cart', isLoggedIn, GetCart);
userRouter.post('/cart', isLoggedIn, PostToCart);
userRouter.delete('/cart', isLoggedIn, RemoveFromCart);
userRouter.patch('/cart', isLoggedIn, UpdateQuantity);
userRouter.delete('/clear-cart', isLoggedIn, ClearCart);
userRouter.post('/add-address', isLoggedIn, AddAddress);
userRouter.delete('/delete-address', isLoggedIn, DeleteAddress);

// checkout and payments
userRouter.get('/checkout', isLoggedIn, GetCheckout);
userRouter.post('/checkout', isLoggedIn, PostCheckout);
userRouter.post('/verify-payment', isLoggedIn, VerifyPayment);
userRouter.get('/order-successfull/:id', isLoggedIn, SuccessPage);
userRouter.get('/order-failed/:id', isLoggedIn, FailedPage);
userRouter.post('/order-cancel', isLoggedIn, CancelOrder);
userRouter.post('/order-return', isLoggedIn, ReturnOrder);

// coupon
userRouter.post('/apply-coupon', isLoggedIn, Applycoupon);
userRouter.put('/remove-coupon', isLoggedIn, RemoveCoupon);

// wallet
userRouter.get('/wallet', isLoggedIn, GetWallet);
userRouter.post('/apply-wallet', isLoggedIn, ApplyWallet);

// Product Search
userRouter.get('/search-result', ProductsBySearch);

// Accnt details/LogOut
userRouter.get('/account', isLoggedIn, GetAccount);
userRouter.get('/order-details', isLoggedIn, GetOrderDetails);
// 
userRouter.get('/download-invoice', isLoggedIn, GetInvoice )
// 
userRouter.post('/update-userdata', upload.single('profileimage'), isLoggedIn, UpdateUserdata);
userRouter.post('/get-address', isLoggedIn, EditAddress)
userRouter.post('/update-address', isLoggedIn, UpdateAddress)
userRouter.get('/logout', GetLogout);

//others
userRouter.get('/learn-more', GetLearnMore)
userRouter.get('/about', GetAbout);
userRouter.get('/contact', GetContact);
userRouter.get('/*', Get404);

module.exports = userRouter;