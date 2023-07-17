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
  enableProductStatus,
} = require('../models/product.model');
const { json } = require('body-parser');

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
    console.log("entered");
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
    console.log(productResult.message);
    if (productResult.status) {
      res.status(200).json({ success: true, message: 'Product added succesfully' });
    }
    else if(productResult.message=='A product with the same name already exists.') {
      res.status(422).json({success:false, message:'A product with the same name already exists.'})
    }
    else {
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

//enabling
async function PutEnableProduct(req, res) {
  try {
    const productId = req.params.id;
    const productResult = await enableProductStatus(productId);
    if (productResult.status) {
      res.status(200).json({ success: true, message: 'Product enabled succesfully' });
    } else {
      res.status(500).json({ status: false, message: 'Failed to enable product.' });
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
    const sortOption = req.query.sortOption; 

    const allProductsResult = await fetchAllProducts(page, limit, sortBy, sortOption);
    res.render('user/all-products', {
      products: allProductsResult.products,
      totalPages: allProductsResult.totalPages,
      currentPage: allProductsResult.currentPage,
      limit: allProductsResult.limit,
      productCount: allProductsResult.productCount,
      sortOption: sortOption,
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
    const sortOption = req.query.sortOption;
    
    if (categoryId === "undefined") {
      return res.redirect('/shop');
    }

    const result = await getProductsWithCategory(categoryId, page, limit, sortBy, sortOption);

    if (result.products.length > 0) {
      return res.render('user/shop-category', {
        products: result.products,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
        productCount: result.productCount,
        sortOption: sortOption,
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
    const searchTerm = req.query.keyword;
    const searchRegex = new RegExp(searchTerm, 'gi');
    const searchedProducts = await searchProductsWithRegex(searchRegex);
    res.render('user/search-result', { products: searchedProducts }); 
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
  PutEnableProduct,
  PutProductDetails,
  GetProduct,
  GetAllProducts,
  GetProductImages,
  CategoryProduct,
  ProductsBySearch,
  // SearchResult,
};
