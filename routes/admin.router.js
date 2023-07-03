const express = require('express');
const adminRouter = express.Router();

const upload = require('../config/multer');

const {
  httpGetDashBoard,
  httpGetLogin,
  httpPostLogin,
  httpGetLogout,
  httpGetUsers,
  httpPutBlockUser,
  httpGet404,
  // httpGetGraphData,
  // httpGetChartData,
  // httpGetReport,
} = require('../controllers/admin.controller');

const {
  httpGetProducts,
  httpGetAddProduct,
  httpPostAddProduct,
  httpGetEditProduct,
  httpGetProductImages,
  httpPutProduct,
  httpPutProductDetails,
} = require('../controllers/product.controller');

const {
  httpGetCategories,
  httpPostCategories,
  httpPutCategory,
  httpPutCategoryName,
} = require('../controllers/category.controller');

const { isAdminLoggedIn, isAdminLoggedOut } = require('../middlewares/auth.handler');

adminRouter.get('/', isAdminLoggedIn, httpGetDashBoard);
adminRouter.get('/login', isAdminLoggedOut, httpGetLogin);
adminRouter.post('/login', isAdminLoggedOut, httpPostLogin);
adminRouter.get('/logout', isAdminLoggedIn, httpGetLogout);

adminRouter.get('/categories', isAdminLoggedIn, httpGetCategories);
adminRouter.post('/categories', isAdminLoggedIn, httpPostCategories);
adminRouter.put('/category-status', isAdminLoggedIn, httpPutCategory);
adminRouter.put('/category-name', isAdminLoggedIn, httpPutCategoryName);

adminRouter.get('/users', isAdminLoggedIn, httpGetUsers);
adminRouter.put('/user-status', isAdminLoggedIn, httpPutBlockUser);

adminRouter.get('/products', isAdminLoggedIn, httpGetProducts);
adminRouter.get('/add-products', isAdminLoggedIn, httpGetAddProduct);
adminRouter.post('/add-products',upload.array('productImage', 4),isAdminLoggedIn,httpPostAddProduct);

adminRouter.get('/edit-product/:slug', isAdminLoggedIn, httpGetEditProduct);
adminRouter.put('/edit-product',upload.array('productImage', 4),isAdminLoggedIn,httpPutProductDetails);
adminRouter.get('/getProductImages/:id', isAdminLoggedIn, httpGetProductImages);
adminRouter.put('/product-status/:id', isAdminLoggedIn, httpPutProduct);

adminRouter.get('/*', httpGet404);

module.exports = adminRouter;