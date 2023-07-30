const productDatabase = require('../schema/product.schema');
const reviewDatabse = require('../schema/review.schema')
const cloudinary = require('../config/cloudinary');
const slugify = require('slugify');
const { handleError } = require('../middlewares/error.handler');

async function setProductImage(productId, remainingImageUrls) {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { productImageUrls: remainingImageUrls },
      { new: true }
    );

    if (!product) {
      throw new Error('Product not found');
    }

    return { success: true, message: 'Product image updated successfully' };
  } catch (error) {
    throw new Error('Failed to update product image');
  }
}

async function getProductStocks() {
  try {
    const productStock = await productDatabase.find({}).populate('productCategory').exec();
    const stockData = [];

    for (const product of productStock) {
      const { productName, productCategory, productPrice, stocks } = product;
      const productDetails = {
        productName,
        productCategory: productCategory ? productCategory.name : 'Unknown Category',
        productPrice,
        stocks,
      };
      stockData.push(productDetails);
    }
    return stockData;
  } catch (error) {
    throw new Error('Fetching product was failed!');
  }
}

async function fetchAllProducts(page, limit, sortBy, sortOption) {
  try {
    let filterOptions = {};
    let sortOptions = {};

    if (sortBy) {
      switch (sortBy) {
        case 'featured':
          filterOptions = { featured: true };
          break;
        case 'lowToHigh':
          sortOptions = { productPrice: 1 }; // Sort by price: low to high
          break;
        case 'highToLow':
          sortOptions = { productPrice: -1 }; // Sort by price: high to low
          break;
        case 'releaseDate':
          sortOptions = { createdAt: -1 }; // Sort by release date (descending)
          break;
        default:
          break;
      }
    }

    let query = productDatabase.find({ productStatus: { $in: [true, false] } });

    if (Object.keys(filterOptions).length > 0) {
      query = query.find(filterOptions);
    }

    let products = await query
      .populate('productCategory')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    let totalProducts = await productDatabase.countDocuments({
      productStatus: { $in: [true, false] },
      ...filterOptions,
    });

    let totalPages = Math.ceil(totalProducts / limit);

    return {
      status: true,
      products: products,
      totalPages: totalPages,
      currentPage: page,
      limit: limit,
      productCount: totalProducts,
      sortOption: sortOption,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message };
  }
}

async function addReview(userId, reviewText, rating, productResult) {
  try {
    const newReview = new reviewDatabse({
      reviewer: userId,
      reviewText: reviewText,
      rating: rating,
      product: productResult.product._id,
    });
    let savedReview = await newReview.save();
    if (savedReview) {
      productResult.product.productReview.push(savedReview._id);
      await productResult.product.save();
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.error('Error adding review:', error);
  }
}


async function fetchProduct(slug) {
  try {
    const product = await productDatabase.findOne({ slug: slug }).populate('productCategory');
    if (!product) {
      return ({ status: false })
    }
    if (!product.productStatus) {
      return { status: false };
    } else {
      return { status: true, product };
    }
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`);
  }
}

async function addNewProduct(dataBody, dataFiles) {
  const {
    productName,
    productDescription,
    productPrice,
    productOldPrice,
    stocks,
    productCategory,
    featured,
  } = dataBody;

  const existingProduct = await productDatabase.findOne({ productName: productName });
  if (existingProduct) {
    return ({ status: false, message: "A product with the same name already exists." })
  }

  const product = new productDatabase({
    productName: productName,
    productDescription: productDescription,
    productPrice: productPrice,
    productOldPrice: productOldPrice,
    stocks: stocks,
    productCategory: productCategory,
    featured: featured,
    deleteStatus: false,
  });
  product.slug = slugify(productName, { lower: true });

  try {
    const imageUrlList = [];
    for (let i = 0; i < dataFiles.length; i++) {
      let locaFilePath = dataFiles[i].path;
      let response = await cloudinary.uploader.upload(locaFilePath, {
        folder: 'traction/product_images',
        unique_filename: true,
      });
      imageUrlList.push(response.url);
    }

    product.productImageUrls = imageUrlList;
    const result = await product.save();
    if (result) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error adding products: ${error.message}`);
  }
}

async function updateProductStatus(productId) {
  try {
    const product = await productDatabase.findByIdAndUpdate(
      { _id: productId },
      { $set: { productStatus: false } },
    );
    if (product) {
      return { status: true, product };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }
}

async function enableProductStatus(productId) {
  try {
    const product = await productDatabase.findByIdAndUpdate(
      { _id: productId },
      { $set: { productStatus: true } },
    );
    if (product) {
      return { status: true, product };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }
}

async function getProductImages(productId) {
  try {
    const product = await productDatabase.findById(productId).select('productImageUrls');
    return product;
  } catch (error) {
    throw new Error(`Error fetchig product images: ${error.message}`);
  }
}

async function updateProduct(productId, productData, productImages, deletedImages) {
  try {
    const product = await productDatabase.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (deletedImages && deletedImages.length > 0) {
      product.productImageUrls = product.productImageUrls.filter(url => !deletedImages.includes(url));
      if (product.productImageUrls.length === 0 && productImages?.length === 0) {
        return { status: false, message: 'Minimum 1 image required' }
      }
    }
    if (productImages) {
      if (productImages.length + product.productImageUrls.length > 4) {
        return { status: false, message: 'Cant add more than four images' }
      }

      for (let i = 0; i < productImages.length; i++) {
        let localFilePath = productImages[i].path;
        let response = await cloudinary.uploader.upload(localFilePath, {
          folder: 'traction/product_images',
          unique_filename: true,
        });
        product.productImageUrls.push(response.url);
      }
    }

    product.productName = productData.productName || product.productName;
    product.productDescription = productData.productDescription || product.productDescription;
    product.productPrice = productData.productPrice || product.productPrice;
    product.productOldPrice = productData.productOldPrice || product.productOldPrice;
    product.stocks = productData.stocks || product.stocks;
    product.productCategory = productData.productCategory || product.productCategory;
    product.featured = productData.featured || product.featured;

    const updatedProduct = await product.save();

    return { status: true, updatedProduct: updatedProduct, message: "Product updated successfully" };
  } catch (error) {
    throw new Error(`Error updating product details: ${error.message}`);
  }
}

async function getProductsWithCategory(categoryId, page, limit, sortBy, sortOption) {
  try {
    if (sortBy) {
      let sortOptions = {};
      let filterOptions = {};
      switch (sortBy) {
        case 'featured':
          filterOptions = { featured: true };
          break;
        case 'lowToHigh':
          sortOptions = { productPrice: 1 }; // Sort by price: low to high
          break;
        case 'highToLow':
          sortOptions = { productPrice: -1 }; // Sort by price: high to low
          break;
        case 'releaseDate':
          sortOptions = { createdAt: -1 }; // Sort by release date (descending)
          break;
        default:
          break;
      }
      var products = await productDatabase
        .find({ $and: [{ productCategory: categoryId }, filterOptions] })
        .sort(sortOptions) // Apply the sorting options
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      var products = await productDatabase
        .find({ productCategory: categoryId })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products: products,
      totalPages: totalPages,
      currentPage: page,
      limit: limit,
      productCount: totalProducts,
      sortOption: sortOption,
    };
  } catch (error) {
    throw new Error(`Error searching products with category: ${error.message}`);
  }
}

async function searchProductsWithRegex(searchRegex) {
  try {
    const products = await productDatabase.find({ productName: searchRegex });
    return products;
  } catch (error) {
    throw new Error(`Error while searching products`);
  }
}

async function calculateProductAverageRating(productId) {
  try {
    const product = await productDatabase.findById(productId).populate('productReview');
    if (!product || !product.productReview || product.productReview.length === 0) {
      return 0; 
    }
    const totalRating = product.productReview.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / product.productReview.length;
    const productRating = Math.min(Math.max(averageRating, 1), 5);
    return productRating;
  } catch (error) {
    throw new Error(`Error calculating average rating: ${error.message}`);
  }
}


module.exports = {
  fetchAllProducts,
  fetchProduct,
  addNewProduct,
  updateProductStatus,
  getProductImages,
  updateProduct,
  getProductsWithCategory,
  searchProductsWithRegex,
  enableProductStatus,
  setProductImage,
  getProductStocks,
  addReview,
  calculateProductAverageRating,
};
