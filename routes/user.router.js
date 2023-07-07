const express = require('express');
const userRouter = express.Router();

const upload = require('../config/multer');

const { isLoggedIn, isLoggedOut } = require('../middlewares/auth.handler');

const { GetAbout, GetContact } = require('../controllers/page.controller')

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
  UpdateUserdata,
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
  VerifyPayment,
  SuccessPage,
  FailedPage,
  CancelOrder,
  ReturnOrder,
  DeleteAddress,
  // GetWallet,
  // ApplyWallet,
  GetOrderDetails,
} = require('../controllers/order.controller');

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

//cart
userRouter.get('/cart', isLoggedIn, GetCart);
userRouter.post('/cart', isLoggedIn, PostToCart);
userRouter.delete('/cart', isLoggedIn, RemoveFromCart);
userRouter.patch('/cart', isLoggedIn, UpdateQuantity);
userRouter.delete('/clear-cart', isLoggedIn, ClearCart);
userRouter.get('/checkout', isLoggedIn, GetCheckout);
userRouter.post('/checkout', isLoggedIn, PostCheckout);
userRouter.post('/add-address', isLoggedIn, AddAddress);
userRouter.delete('/delete-address', isLoggedIn, DeleteAddress);

userRouter.post('/verify-payment', isLoggedIn, VerifyPayment);
userRouter.get('/order-successfull/:id', isLoggedIn, SuccessPage);
userRouter.get('/order-failed/:id', isLoggedIn, FailedPage);

userRouter.post('/order-cancel', isLoggedIn, CancelOrder);
userRouter.post('/order-return', isLoggedIn, ReturnOrder);

// Product Search
userRouter.get('/search', SearchResult);
userRouter.post('/search-products', ProductsBySearch);

// Accnt details/LogOut
userRouter.get('/account', isLoggedIn, GetAccount);
userRouter.get('/order-details', isLoggedIn, GetOrderDetails);
userRouter.post('/update-userdata', upload.single('profileimage'), isLoggedIn, UpdateUserdata);
userRouter.get('/logout', GetLogout);

userRouter.get('/about', GetAbout);
userRouter.get('/contact', GetContact);
userRouter.get('/*', Get404);

module.exports = userRouter;