
async function removeProduct(productId) {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Delete product from the cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!',
    });

    if (result.isConfirmed) {
      const url = '/cart';
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateCartDisplay(productId, data.total);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

function updateCartDisplay(productId, total) {
  // Remove the deleted product from the DOM
  const dropdownItem = document.querySelector(`li[data-product-id="${productId}"]`);
  if (dropdownItem) {
    dropdownItem.remove();
  }

  const cartItem = document.querySelector(`tr[data-item-id="${productId}"]`);
  if (cartItem) {
    var runCode = true;
    cartItem.remove();
  }

  // Update cart count
  const countElement1 = document.getElementById('cart-count1');
  const countElement2 = document.getElementById('cart-count2');
  const count1 = parseInt(countElement1.textContent);
  const count2 = parseInt(countElement1.textContent);
  if (count1 > 0 && count2 > 0) {
    countElement1.textContent = count1 - 1;
    countElement2.textContent = count2 - 1;
  }

  // Check if the cart is empty
  const cartItems = document.querySelectorAll('tr[data-item-id]');

if (runCode && cartItems.length === 0) {
  window.location.reload();
  return;
}
if( count1 == 0 && count2 == 0){
  window.location.reload();
  return;
}

  // Check if any products are marked as out of stock
  const outOfStockElements = document.querySelectorAll('.outOfStock');
  let isOutOfStock = false;
  outOfStockElements.forEach((outOfStockElement) => {
    if (outOfStockElement.textContent === 'out of stock') {
      isOutOfStock = true;
    }
  });

  // Update checkout button based on out-of-stock status
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    if (isOutOfStock) {
      checkoutBtn.classList.add('disabled');
    } else {
      checkoutBtn.classList.remove('disabled');
    }
  }

  // Update subtotal and total amounts
  updateSubtotalAndTotal(total);
}


// Get all the quantity divs
var quantityDivs = document.querySelectorAll('.detail-qty');

// Loop through each quantity div and add event listeners to the up and down buttons
quantityDivs.forEach((quantityDiv) => {
  const productId = quantityDiv.dataset.productid;

  const stockQty = quantityDiv.dataset.stockqty;

  const qtySpan = quantityDiv.querySelector(`.qty-${productId}`);

  const outOfStockSpn = document.getElementById(`outOfStock-${productId}`);

  const qtyUpBtn = quantityDiv.querySelector('.qty-up');

  const qtyDownBtn = quantityDiv.querySelector('.qty-down');

  if(outOfStockSpn.innerHTML==='out of stock'){
    document.getElementById('checkoutBtn').classList.add('disabled')
  }

  qtyUpBtn.addEventListener('click', () => {
    const currentQty = parseInt(qtySpan.dataset.quantity);
    const newQty = currentQty + 1;
    qtySpan.dataset.quantity = newQty;
    qtySpan.textContent = newQty;

    if(newQty>stockQty){
      outOfStockSpn.innerHTML = "out of stock"
    }else{
      outOfStockSpn.innerHTML = ""
    }

    let arr = false;
    document.querySelectorAll('.outOfStock').forEach((stock)=>{
      if(stock.textContent === 'out of stock'){
        arr = true;
     }
     })
    
     if(arr){
      document.getElementById('checkoutBtn').classList.add('disabled')
    }else{
       document.getElementById('checkoutBtn').classList.remove('disabled')
     }

    updateProductQuantity(productId, newQty);

    const navbarQtySpan = document.querySelector(`#qty-navbar-${productId}`);
    if (navbarQtySpan) {
      navbarQtySpan.textContent = `${newQty} ×`;
    }
  });

  //event listner for quantity update
  qtyDownBtn.addEventListener('click', () => {
    const currentQty = parseInt(qtySpan.dataset.quantity);
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      qtySpan.dataset.quantity = newQty;
      qtySpan.textContent = newQty;

      if(newQty>stockQty){

        outOfStockSpn.innerHTML = "out of stock"
      }else{
        outOfStockSpn.innerHTML = ""
      }

      let arr = false;
      document.querySelectorAll('.outOfStock').forEach((stock)=>{
        if(stock.textContent === 'out of stock'){
         
          arr = true;
       }
       })
      
       if(arr){
        document.getElementById('checkoutBtn').classList.add('disabled')
      }else{
         document.getElementById('checkoutBtn').classList.remove('disabled')
       }

      updateProductQuantity(productId, newQty);

      const navbarQtySpan = document.querySelector(`#qty-navbar-${productId}`);
      if (navbarQtySpan) {
        navbarQtySpan.textContent = `${newQty} ×`;
      }
    }
  });
});

function updateProductQuantity(productId, quantity) {
  fetch('/cart', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity: quantity,
      productId: productId,
    }),
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(function (data) {
      updateSubtotalAndTotal(data.total);
    })
    .catch(function (error) {
      console.error('There was a problem with the updating product operation:', error);
    });

  var price = Number(
    document.querySelector(`tr[data-item-id="${productId}"] #subtotal`).getAttribute('data-price'),
  );
  var subtotalElement = document.querySelector(`tr[data-item-id="${productId}"] #subtotalValue`);
  var subtotal = price * quantity;
  subtotalElement.textContent = subtotal.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
}

function updateSubtotalAndTotal(subtotal) {
  var navSubtotalElement = document.querySelector('#nav-sub-total');
  var cartSubtotalElement = document.querySelector('#cart-sub-total');
  var totalElement = document.querySelector('#total');

  if (navSubtotalElement) {
    navSubtotalElement.textContent = '₹' + subtotal.toFixed(2);
  }
  
  if (cartSubtotalElement) {
    cartSubtotalElement.textContent = '₹' + subtotal.toFixed(2);
  }
  
  if (totalElement) {
    totalElement.textContent = '₹' + subtotal.toFixed(2); 
  }
}

