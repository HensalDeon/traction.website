function removeProduct(productId) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Delete product from the cart?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes,delete!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      const url = '/cart';
      fetch(url, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Product deleted:', data);
          window.location.reload()

          const dropdownItem = document.querySelector(`li[data-product-id="${productId}"]`);

          if (window.location.href === 'https://getmyshoe/cart' || window.location.href === 'http://localhost:8000/cart' ) {
            const cartItem = document.querySelector(`tr[data-item-id="${productId}"]`);

            if (cartItem.parentElement.rows.length === 2) {
              window.location.reload();
              return;
            }

            cartItem.remove();

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
          }

          dropdownItem.remove();

          const countElement1 = document.getElementById('cart-count1');
          const countElement2 = document.getElementById('cart-count2');
          const count1 = parseInt(countElement1.textContent);
          const count2 = parseInt(countElement1.textContent);
          if (count1 > 0 && count2 > 0) {
            countElement1.textContent = count1 - 1;
            countElement2.textContent = count2 - 1;
          }

          updateSubtotalAndTotal(data.total);
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    }
  });
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
      console.log(data);
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

