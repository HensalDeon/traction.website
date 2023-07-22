const cartDatabase = require('../schema/cart.schema');
const productDatabase = require('../schema/product.schema');
const userDatabase = require('../schema/user.schema');
const wishlistDatabase = require('../schema/wishlist.schema')

async function addItemToWishlist(userId, productId) {
  try {
    const product = await productDatabase
      .findById(productId)
      .select('productPrice productImageUrls productName _id stocks');
    if (!product) {
      return { status: false, message: 'product not found' };
    }

    let wishlist = await wishlistDatabase.findOne({ user: userId });
    let productAlreadyExist = false;
    if (wishlist) {
      const itemIndex = wishlist.items.findIndex((item) => item.product.equals(productId));
      if (itemIndex >= 0) {
        productAlreadyExist = true;
        return {
          status: false,
          message: 'product already exists!',
          productData: product, productAlreadyExist
        }
      } else {
        wishlist.items.push({
          product: productId,
          price: product.productPrice,
        });
        await wishlist.save();
        return {
          status: true,
          message: 'product added to cart',
          productData: product, productAlreadyExist
        }
      }
    } else {
      const newWishlist = await wishlistDatabase.create({
        user: userId,
        items: [
          {
            product: productId,
            price: product.productPrice,
          }
        ]
      })
      await userDatabase.findByIdAndUpdate(userId, { wishlist: newWishlist._id });
      return {
        status: true,
        message: 'product added to cart',
        productData: product,
      };
    }
  } catch (error) {
    throw new Error('Something wrong while adding product');
  }
}

async function addItemToCart(userId, productId, quantity) {
  try {
    const product = await productDatabase
      .findById(productId)
      .select('productPrice productImageUrls productName _id stocks');

    if (!product) {
      return { status: false, message: 'product not found' };
    }

    let cart = await cartDatabase.findOne({ user: userId });

    let productAlreadyExist = false;
    if (cart) {
      // If cart already exists, check if the product is already in the cart
      const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));
      if (itemIndex > -1) {
        // If product already in cart, update its quantity and price
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = product.productPrice;
        productAlreadyExist = true;
      } else {
        // If product not in cart, add new item to the items array
        cart.items.push({
          product: productId,
          quantity: quantity,
          price: product.productPrice,
        });
      }

      cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await cart.save();
      return {
        status: true,
        message: 'product added to cart',
        productData: product, productAlreadyExist

      };
    }

    // If cart doesn't exist, create a new cart and add the product
    const newCart = await cartDatabase.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity: quantity,
          price: product.productPrice,
        },
      ],
      total: product.productPrice,
    });
    await userDatabase.findByIdAndUpdate(userId, { cart: newCart._id });
    return {
      status: true,
      message: 'product added to cart',
      productData: product,
    };
  } catch (error) {
    throw new Error('Something wrong while adding product');
  }
}

async function removeItemFromWishlist (userId, productId){
  try {
    const product = await productDatabase.findById(productId).select('productPrice');

    if (!product) {
      return { status: false, message: 'product not found' };
    }
    let wishlist = await wishlistDatabase.findOne({ user: userId });
    const itemIndex = wishlist.items.findIndex((item) => item.product.equals(productId));
    if (itemIndex > -1) {
      wishlist.items.splice(itemIndex, 1);
      await wishlist.save();
      return {
        status: true,
        message: 'product removed from Wishlist',
      };
    } else {
      return { status: false, message: 'product not found in wishlist' };
    }

  } catch (error) {
    throw new Error('Something went wrong while removing product from cart');
  }
}
async function removeItemFromCart(userId, productId) {
  try {
    const product = await productDatabase.findById(productId).select('productPrice');

    if (!product) {
      return { status: false, message: 'product not found' };
    }
    let cart = await cartDatabase.findOne({ user: userId });
    if (cart) {
      // If cart already exists, check if the product is in the cart
      const itemIndex = cart.items.findIndex((item) => item.product.equals(productId));
      if (itemIndex > -1) {
        // If product is in cart, remove it
        cart.items.splice(itemIndex, 1);
        cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        return {
          status: true,
          message: 'product removed from cart',
          total: cart.total,
        };
      } else {
        return { status: false, message: 'product not found in cart' };
      }
    } else {
      return { status: false, message: 'cart not found' };
    }
  } catch (error) {
    throw new Error('Something went wrong while removing product from cart');
  }
}
async function fetchWishlistProducts(userId) {
  try {
    const wishlist = await wishlistDatabase.findOne({ user: userId }).populate('items.product');
    if (!wishlist) {
      return { status: false, wishlist, total: 0 }
    } else {
      return { status: true, wishlist }
    }
  } catch (error) {
    throw new Error('Something went wrong while fetching products to wishlist');
  }
}

async function fetchCartProducts(userId) {
  try {
    const cart = await cartDatabase.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return { status: false, cart, total: 0 };
    } else {
      const total = cart.items.reduce((acc, item) => {
        return acc + item.quantity * item.price;
      }, 0);
      return { status: true, cart, total };
    }
  } catch (error) {
    throw new Error('Something went wrong while fetching products to cart');
  }
}

async function clearCartItems(userId) {
  try {
    const cart = await cartDatabase.findOne({ user: userId });
    if (!cart) {
      return { status: false, message: 'Cart not found' };
    } else {
      cart.items = [];
      cart.total = 0;
      await cart.save();
      return { status: true, message: 'Cart cleared successfully' };
    }
  } catch (error) {
    throw new Error('Something went wrong while clearing products in the cart');
  }
}

async function updateCartDetails(quantity, productId, userId) {
  try {
    const cart = await cartDatabase.findOne({ user: userId });
    if (cart) {
      const item = cart.items.find((item) => item.product.equals(productId));

      item.quantity = quantity;

      cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

      await cart.save();

      return {
        status: true,
        message: 'cart updated!',
        total: cart.total,
      };
    } else {
      return { status: false, message: 'cart not found!' };
    }
  } catch (error) {
    throw new Error(`Error updating cart for user with ID: ${userId}`, error);
  }
}

async function cartProductTotal(userId) {
  try {
    const cart = await cartDatabase.findOne({ user: userId });
    if (cart && cart.total > 0) {
      return { status: true, cart };
    } else {
      return { status: false };
    }
  } catch (error) {
    throw new Error('Error finding cart count!');
  }
}



module.exports = {
  addItemToCart,
  removeItemFromCart,
  fetchCartProducts,
  clearCartItems,
  updateCartDetails,
  cartProductTotal,
  fetchWishlistProducts,
  addItemToWishlist,
  removeItemFromWishlist,
};
