const { fetchCategories } = require('../models/category.model');
// const { fetchCartProducts } = require('../models/cart.model');
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
    if (req.session.user) {
      res.locals.user = req.session.user;
    }
    next();
  } catch (error) {
    handleError(res, error);
  }
}

// async function cartProducts(req, res, next) {
//   try {
//     if (req.session.user) {
//       const cartResult = await fetchCartProducts(req.session.user._id);
//       res.locals.cart = cartResult.cart;
//     }
//     next();
//   } catch (error) {
//     handleError(res, error);
//   }
// }



// module.exports = { categoryMiddleware, loggedInMiddleware, cartProducts };
module.exports = {categoryMiddleware,loggedInMiddleware}
