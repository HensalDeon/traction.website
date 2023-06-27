const productDatabase = require('../schema/product.schema');
const cloudinary = require('../config/cloudinary');
const slugify = require('slugify');

async function fetchAllProducts(page, limit, sortBy) {
  try {
    try {
      if (sortBy) {
        let sortOptions = {};

        switch (sortBy) {
          case 'featured':
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
          .find({ productStatus: true })
          .populate('productCategory')
          .sort(sortOptions)
          .skip((page - 1) * limit)
          .limit(limit);
      } else {
        var products = await productDatabase
          .find({ productStatus: true })
          .populate('productCategory')
          .skip((page - 1) * limit)
          .limit(limit);
      }

      const totalProducts = await productDatabase.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        status: true,
        products: products,
        totalPages: totalPages,
        currentPage: page,
        limit: limit,
        productCount: totalProducts,
      };
    } catch (error) {
      console.log(error);
      return { status: false, message: error.message };
    }
  } catch (error) {
    throw new Error(`Error finding products: ${error.message}`);
  }
}

// async function fetchProduct(slug) {
//   try {
//     const product = await productDatabase.findOne({ slug: slug }).populate('productCategory');
//     if (!product.productStatus) {
//       return { status: false };
//     } else {
//       return { status: true, product };
//     }
//   } catch (error) {
//     throw new Error(`Error fetching product: ${error.message}`);
//   }
// }

// async function addNewProduct(dataBody, dataFiles) {
//   const {
//     productName,
//     productDescription,
//     productPrice,
//     productOldPrice,
//     stocks,
//     productCategory,
//   } = dataBody;

//   const product = new productDatabase({
//     productName: productName,
//     productDescription: productDescription,
//     productPrice: productPrice,
//     productOldPrice: productOldPrice,
//     stocks: stocks,
//     productCategory: productCategory,
//     deleteStatus: false,
//   });
//   product.slug = slugify(productName, { lower: true });

//   try {
//     const imageUrlList = [];
//     for (let i = 0; i < dataFiles.length; i++) {
//       let locaFilePath = dataFiles[i].path;
//       let response = await cloudinary.uploader.upload(locaFilePath, {
//         folder: 'space/product_images',
//         unique_filename: true,
//       });
//       imageUrlList.push(response.url);
//     }

//     product.productImageUrls = imageUrlList;
//     const result = await product.save();
//     if (result) {
//       return { status: true };
//     } else {
//       return { status: false };
//     }
//   } catch (error) {
//     throw new Error(`Error adding products: ${error.message}`);
//   }
// }

// async function updateProductStatus(productId) {
//   try {
//     const product = await productDatabase.findByIdAndUpdate(
//       { _id: productId },
//       { $set: { productStatus: false } },
//     );
//     if (product) {
//       return { status: true, product };
//     } else {
//       return { status: false };
//     }
//   } catch (error) {
//     throw new Error(`Error updating product: ${error.message}`);
//   }
// }

// async function getProductImages(productId) {
//   try {
//     const product = await productDatabase.findById(productId).select('productImageUrls');
//     return product;
//   } catch (error) {
//     throw new Error(`Error fetchig product images: ${error.message}`);
//   }
// }

// async function updateProduct(productId, productData, productImages) {
//   try {
//     const product = await productDatabase.findById(productId);

//     if (!product) {
//       throw new Error('Product not found');
//     }

//     if (
//       productImages &&
//       product.productImageUrls.length < 4 &&
//       product.productImageUrls.length + productImages.length < 4
//     ) {
//       for (let i = 0; i < productImages.length; i++) {
//         let locaFilePath = productImages[i].path;
//         let response = await cloudinary.uploader.upload(locaFilePath, {
//           folder: 'space/product_images',
//           unique_filename: true,
//         });
//         product.productImageUrls.push(response.url);
//       }
//     }

//     product.productName = productData.productName || product.productName;
//     product.productDescription = productData.productDescription || product.productDescription;
//     product.productPrice = productData.productPrice || product.productPrice;
//     product.productOldPrice = productData.productOldPrice || product.productOldPrice;
//     product.stocks = productData.stocks || product.stocks;
//     product.productCategory = productData.productCategory || product.productCategory;

//     const updatedProduct = await product.save();

//     return updatedProduct;
//   } catch (error) {
//     throw new Error(`Error updating product details: ${error.message}`);
//   }
// }

// async function getProductsWithCategory(categoryId, page, limit, sortBy) {
//   try {
//     if (sortBy) {
//       let sortOptions = {};

//       switch (sortBy) {
//         case 'featured':
//           break;
//         case 'lowToHigh':
//           sortOptions = { productPrice: 1 }; // Sort by price: low to high
//           break;
//         case 'highToLow':
//           sortOptions = { productPrice: -1 }; // Sort by price: high to low
//           break;
//         case 'releaseDate':
//           sortOptions = { createdAt: -1 }; // Sort by release date (descending)
//           break;
//         default:
//           break;
//       }
//       var products = await productDatabase
//         .find({ productCategory: categoryId })
//         .sort(sortOptions) // Apply the sorting options
//         .skip((page - 1) * limit)
//         .limit(limit);
//     } else {
//       var products = await productDatabase
//         .find({ productCategory: categoryId })
//         .skip((page - 1) * limit)
//         .limit(limit);
//     }

//     const totalProducts = products.length;
//     const totalPages = Math.ceil(totalProducts / limit);

//     return {
//       products: products,
//       totalPages: totalPages,
//       currentPage: page,
//       limit: limit,
//       productCount: totalProducts,
//     };
//   } catch (error) {
//     throw new Error(`Error searching products with category: ${error.message}`);
//   }
// }

// async function searchProductsWithRegex(searchRegex) {
//   try {
//     const products = await productDatabase.find({ productName: searchRegex });
//     return products;
//   } catch (error) {
//     throw new Error(`Error while searching products`);
//   }
// }

module.exports = {
  fetchAllProducts,
  // fetchProduct,
  // addNewProduct,
  // updateProductStatus,
  // getProductImages,
  // updateProduct,
  // getProductsWithCategory,
  // searchProductsWithRegex,
};
