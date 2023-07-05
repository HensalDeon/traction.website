const express = require('express');
const adminRouter = express.Router();

const upload = require('../config/multer');

const {
  GetDashBoard,
  GetLogin,
  PostLogin,
  GetLogout,
  GetUsers,
  PutBlockUser,
  Get404,
  // GetGraphData,
  // GetChartData,
  // GetReport,
} = require('../controllers/admin.controller');

const {
  GetProducts,
  GetAddProduct,
  PostAddProduct,
  GetEditProduct,
  GetProductImages,
  PutProduct,
  PutEnableProduct,
  PutProductDetails,
} = require('../controllers/product.controller');

const {
  GetCategories,
  PostCategories,
  PutCategory,
  PutCategoryName,
} = require('../controllers/category.controller');

// session handler
const { isAdminLoggedIn, isAdminLoggedOut } = require('../middlewares/auth.handler');

// Login/Logout
adminRouter.get('/', isAdminLoggedIn, GetDashBoard);
adminRouter.get('/login', isAdminLoggedOut, GetLogin);
adminRouter.post('/login', isAdminLoggedOut, PostLogin);
adminRouter.get('/logout', isAdminLoggedIn, GetLogout);

//Category Management
adminRouter.get('/categories', isAdminLoggedIn, GetCategories);
adminRouter.post('/categories', isAdminLoggedIn, PostCategories);
adminRouter.put('/category-status', isAdminLoggedIn, PutCategory);
adminRouter.put('/category-name', isAdminLoggedIn, PutCategoryName);

//User Management
adminRouter.get('/users', isAdminLoggedIn, GetUsers);
adminRouter.put('/user-status', isAdminLoggedIn, PutBlockUser);

//Product Management
adminRouter.get('/products', isAdminLoggedIn, GetProducts);
adminRouter.get('/add-products', isAdminLoggedIn, GetAddProduct);
adminRouter.post('/add-products',upload.array('productImage', 4),isAdminLoggedIn,PostAddProduct);

adminRouter.get('/edit-product/:slug', isAdminLoggedIn, GetEditProduct);
adminRouter.put('/edit-product',upload.array('productImage', 4),isAdminLoggedIn,PutProductDetails);
adminRouter.get('/getProductImages/:id', isAdminLoggedIn, GetProductImages);
adminRouter.put('/product-status/:id', isAdminLoggedIn, PutProduct);
adminRouter.put('/product-enable/:id', isAdminLoggedIn, PutEnableProduct);

//Others(404)
adminRouter.get('/*', Get404);

module.exports = adminRouter;