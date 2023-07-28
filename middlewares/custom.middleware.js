const { fetchCategories } = require('../models/category.model');
const { fetchUserData } = require('../models/userAuth.model');
const { fetchCartProducts, fetchWishlistProducts } = require('../models/cart.model');
const { handleError } = require('./error.handler');

async function categoryMiddleware(req, res, next) {
  try {
    const categoryResult = await fetchCategories();
    res.locals.categories = categoryResult.categories;
    next();
  } catch (error) {
    handleError(res, error);
  }
}

async function loggedInMiddleware(req, res, next) {
  try {
    // if (req.session.user) {
    //   res.locals.user = req.session.user;
    // }
    
    
    if (req.session.user) {
      const userStatus = await fetchUserData(req.session.user._id); 
      console.log(userStatus.status,'❤️❤️❤️❤️ ',req.session.user._id);
      if (userStatus.status === false) {
        req.session.userloggedIn = false;
        req.session.user = null;
        return res.redirect('/login');
      }

      res.locals.user = req.session.user;
    }
    next();
  } catch (error) {
    handleError(res, error);
  }
}

async function cartProducts(req, res, next) {
  try {
    if (req.session.user) {
      const cartResult = await fetchCartProducts(req.session.user._id);
      const wishlistResult = await fetchWishlistProducts(req.session.user._id);
      res.locals.cart = cartResult.cart;
      res.locals.wishlist = wishlistResult.wishlist;
    }
    next();
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = { categoryMiddleware, loggedInMiddleware, cartProducts };

