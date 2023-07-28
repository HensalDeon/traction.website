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
  GetGraphData,
  GetChartData,
  GetReport,
  GetDisplayReport,
  GetStocksReport,
  GetReportExcel
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

const {
  GetOrderPage,
  ChangeOrderStatus,
  GetOrderDetails,
} = require('../controllers/order.controller');

const {
  GetBannerPage,
  EditBanner,
  AddBanner,
} = require('../controllers/banner.controller');

const {
  GetCoupons,
  AddCoupons,
  ChangeCouponStatus,
} = require('../controllers/coupon.controller');

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

// Order management
adminRouter.get('/orders', isAdminLoggedIn, GetOrderPage);
adminRouter.post('/order-status', isAdminLoggedIn, ChangeOrderStatus);
adminRouter.get('/order-details', isAdminLoggedIn, GetOrderDetails);

//Banner management
adminRouter.get('/banners', isAdminLoggedIn, GetBannerPage);
adminRouter.post('/add-banner', upload.single('bannerImage'), isAdminLoggedIn, AddBanner);
adminRouter.post('/edit-banner', upload.single('bannerImage'), isAdminLoggedIn, EditBanner);

// coupon management
adminRouter.get('/coupons', isAdminLoggedIn, GetCoupons);
adminRouter.post('/coupons', isAdminLoggedIn, AddCoupons);
adminRouter.put('/coupon-status', isAdminLoggedIn, ChangeCouponStatus);

//Dashboard
adminRouter.get('/graph', isAdminLoggedIn, GetGraphData);
adminRouter.get('/chart', isAdminLoggedIn, GetChartData);
adminRouter.get('/sales-report', isAdminLoggedIn, GetDisplayReport);
adminRouter.get('/sales-report/download', isAdminLoggedIn, GetReport);
adminRouter.get('/sales-report/download-excel', isAdminLoggedIn, GetReportExcel);
adminRouter.get('/stocks-report', isAdminLoggedIn, GetStocksReport);

//Others(404) 
adminRouter.get('/*', Get404);

module.exports = adminRouter;