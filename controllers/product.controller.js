const { handleError } = require('../middlewares/error.handler');

const { fetchCategories } = require('../models/category.model');

const { addProductSchema, updateProductSchema } = require('../config/joi');

const {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProductStatus,
  getProductImages,
  updateProduct,
  getProductsWithCategory,
  searchProductsWithRegex,

  setProductImage,
} = require('../models/product.model');

async function GetProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const productsResult = await fetchAllProducts(page, limit);
    const categoryResult = await fetchCategories();

    if (productsResult.status) {
      return res.render('admin/products', {
        product: productsResult.products,
        categories: categoryResult.categories,
        totalPages: productsResult.totalPages,
        currentPage: productsResult.currentPage,
        limit: productsResult.limit,
        activePage: 'products',
      });
    } else {
      return res.render('admin/products', { product: [], categories: [] });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function GetAddProduct(req, res) {
  try {
    const categoryResult = await fetchCategories();
    return res.render('admin/add-products', {
      categories: categoryResult.categories,
      activePage: 'addproduct',
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function PostAddProduct(req, res) {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }

    const validation = addProductSchema.validate(
      { ...req.body, productImage: req.files },
      { abortEarly: false },
    );

    if (validation.error) {
      return res.json({ success: false, message: validation.error.details[0].message });
    }

    const productResult = await addNewProduct(req.body, req.files);
    if (productResult.status) {
      res.status(200).json({ success: true, message: 'Product added succesfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to add product.' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function GetEditProduct(req, res) {
  try {
    const slug = req.params.slug;
    const productResult = await fetchProduct(slug);
    const categoryResult = await fetchCategories();

    console.log("hiii"+categoryResult.categories);

    if (productResult.status) {
      res.render('admin/update-products', {
        categories: categoryResult.categories,
        product: productResult.product,
        activePage: 'products',
      });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

//soft delete
async function PutProduct(req, res) {
  try {
    const productId = req.params.id;
    const productResult = await updateProductStatus(productId);

    if (productResult.status) {
      res.status(200).json({ success: true, message: 'Product deleted succesfully' });
    } else {
      res.status(500).json({ status: false, message: 'Failed to delete product.' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function PutProductDetails(req, res) {
  try {
    const { deletedImages,...dataBody} = req.body;
    const validation = updateProductSchema.validate(
      { ...dataBody },
      { abortEarly: false },
    );
    
    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error.details[0].message });
    }
    const productResult = await updateProduct(req.body.productId, dataBody, req.files,deletedImages);
    if (productResult.status) {
      return res.json({
        success: true,
        message: productResult.message,
        data: productResult.updatedProduct,
      });
    } else {
      return res.json({ success: false, message: productResult.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

//user
async function GetProduct(req, res) {
  try {
    const slug = req.params.slug;
    const productResult = await fetchProduct(slug);
    const allProductsResult = await fetchAllProducts();
    if (productResult.status) {
      res.render('user/product', {
        product: productResult.product,
        products: allProductsResult.products,
      });
    } else {
      res.status(404).render('user/404', { message: 'Product not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function GetAllProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const sortBy = req.query.sortBy;

    const allProductsResult = await fetchAllProducts(page, limit, sortBy);
    res.render('user/all-products', {
      products: allProductsResult.products,
      totalPages: allProductsResult.totalPages,
      currentPage: allProductsResult.currentPage,
      limit: allProductsResult.limit,
      productCount: allProductsResult.productCount,
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function GetProductImages(req, res) {
  try {
    const images = await getProductImages(req.params.id);
    res.json(images);
  } catch (error) {
    handleError(res, error);
  }
}

async function CategoryProduct(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const sortBy = req.query.sortBy;
    const categoryId = req.params.id;
    
    if (categoryId === "undefined") {
      return res.redirect('/shop');
    }

    const result = await getProductsWithCategory(categoryId, page, limit, sortBy);

    if (result.products.length > 0) {
      return res.render('user/shop-category', {
        products: result.products,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
        productCount: result.productCount,
        categoryId,
      });
    } else {
      return res.redirect('/shop');
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function ProductsBySearch(req, res) {
  try {
    const searchTerm = req.body.searchInput.trim();
    const searchRegex = new RegExp(`^${searchTerm}`, 'i');
    // const searchRegex = new RegExp(searchTerm, 'i');
    const products = await searchProductsWithRegex(searchRegex);

    if (products.length > 0) {
      req.session.searchProducts = products;
      return res.json({ success: true, productsCount: products.length });
    } else {
      return res.json({ success: false, productsCount: products.length });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function SearchResult(req, res) {
  try {
    let products;
    if (req.session.searchProducts) {
      products = req.session.searchProducts;
    } else {
      products = [];
    }
    res.render('user/search-result', { products });
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  GetProducts,
  GetAddProduct,
  PostAddProduct,
  GetEditProduct,
  PutProduct,
  PutProductDetails,
  GetProduct,
  GetAllProducts,
  GetProductImages,
  CategoryProduct,
  ProductsBySearch,
  SearchResult,
};
