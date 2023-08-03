document.addEventListener('DOMContentLoaded', () => {
  const wishlistButtons = document.querySelectorAll('.addToWishlistButton')
  wishlistButtons.forEach((wishlistButton) => {
    wishlistButton.addEventListener('click', (event) => {
      event.preventDefault();
      const productId = wishlistButton.getAttribute('data-product-id')
      const url = '/wishlist'
      fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
        }),
      })
        .then((response) => {
          console.log(response)
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json()
          } else {
            window.location.href = '/login'
          }
        })
        .then((data) => {
          if (data.success) {
            swal.fire({
              title: 'Good job!',
              text: 'Product added to wishlist!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1300
            })

            const wishlistCount = document.getElementById('wishlist-count');
            wishlistCount.textContent = parseInt(wishlistCount.textContent) + 1;

          } else {
            swal.fire({
              title: 'Oops!',
              text: 'Product is already in the wishlist!',
              icon: 'warning',
              showConfirmButton: false,
              timer: 1300
            })
          }
        })
    })
  })
})

async function removeProductWishlist(productId) {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Remove product from the Wishlist?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove!',
    });

    if (result.isConfirmed) {
      const url = '/wishlist';
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
      console.log('Product removed:', data);
      
      // Update cart display without page refresh
      updateCartDisplay(productId, data.total);
    }
  } catch (error) {
    console.error('Error removing product:', error);
  }
}

function updateCartDisplay(productId, total) {
  // Remove the deleted product from the DOM
  const dropdownItem = document.querySelector(`li[data-product-id="${productId}"]`);
  if (dropdownItem) {
    dropdownItem.remove();
  }

  const wishlistItem = document.querySelector(`tr[data-item-id="${productId}"]`);
  if (wishlistItem) {
    var runCode = true;
    wishlistItem.remove();
  }

  // Update wishlist count
  const wishlistCount = document.getElementById('wishlist-count');
  const count = parseInt(wishlistCount.textContent);
  if (count > 0) {
    wishlistCount.textContent = count - 1;
  }

  // Check if the Wishlist is empty
  const wishlistItems = document.querySelectorAll('tr[data-item-id]');
  console.log(wishlistItems);
  console.log('wishlist item: ' + wishlistItems.length);

  if (runCode && wishlistItems.length === 0) {
    window.location.reload();
    return;
  }

}
