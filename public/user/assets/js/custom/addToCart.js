document.addEventListener('DOMContentLoaded', () => {
  const cartButtons = document.querySelectorAll('.addTocartButton')
  cartButtons.forEach((cartButton) => {
    cartButton.addEventListener('click', (event) => {
      event.preventDefault()
      let quantity = 1

      const productId = cartButton.getAttribute('data-product-id')
      const url = '/cart'
      fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
          productId,
        }),
      })
        .then((response) => {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            return response.json()
          } else {
            window.location.href = '/login'
          }
        })
        .then((data) => {
          if (data.success) {
            swal.fire({title: 'Good job!',
            text: 'Product added to cart!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1300 })

            // check if the product already exists in the cart
            const existingCartItem = document.querySelector(
              `li[data-product-id="${data.product._id}"]`,
            )

            //cart count
            const countElement1 = document.getElementById('cart-count1');
            const countElement2 = document.getElementById('cart-count2');

            // get the current navbar subtotal
            const navSubtotalElement = document.querySelector('#nav-sub-total')
            const currentNavSubtotal = parseFloat(navSubtotalElement.textContent.replace('₹', ''))

            // update the navbar subtotal
            const newNavSubtotal = currentNavSubtotal + data.product.productPrice
            navSubtotalElement.textContent = `₹${newNavSubtotal.toFixed(2)}`

            console.log(data);
            if (data.productAlreadyExist) {
              // update the quantity of the existing item
              const quantityEl = existingCartItem.querySelector(`#qty-navbar-${data.product._id}`)
              const currentQuantity = parseInt(quantityEl.textContent)
              quantityEl.textContent = `${currentQuantity + 1} ×`
            } else {
              //increasing count
              countElement1.textContent = parseInt(countElement1.textContent) + 1;
              countElement2.textContent = parseInt(countElement2.textContent) + 1;
              
              // create a new cart item and append it to the cart list
              const cartList = document.querySelector('.shopping-cart-list')
              const newCartItem = document.createElement('li');
              newCartItem.setAttribute('data-product-id', data.product._id);
              newCartItem.innerHTML = `
                <div class="shopping-cart-img">
                  <a href="/product"><img alt="${data.product.productName}" src="${
                data.product.productImageUrls[0]
              }"></a>
                </div>
                <div class="shopping-cart-title">
                  <h4><a href="/product/${data.product._id}">${data.product.productName}</a></h4>
                  <h4><span id="qty-navbar-${data.product._id}">${1} ×</span>₹${
                data.product.productPrice
              }</h4>
                </div>
                <div class="shopping-cart-delete">
                  <a onclick="removeProduct('${
                    data.product._id
                  }')"><i class="fi-rs-cross-small"></i></a>
                </div>
              `
              console.log('cartList');
              console.log(cartList);
              cartList.appendChild(newCartItem)
            }
          } else {
            swal.fire({
              text: 'Product is Out of Stock!',
              icon: 'error',
              showConfirmButton: false,
              timer: 1300,
            })
          }
        })
    })
  })
})
