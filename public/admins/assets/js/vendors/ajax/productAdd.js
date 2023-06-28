//add-products
const form = document.getElementById('myForm');
const submitButton = document.getElementById('add-product-btn');
let images = [];
let selectedImages = []
submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  const formData = new FormData(form);

  formData.delete('productImage')

  for (let i = 0; i < images.length; i++) {
    formData.append('productImage', images[i].file);
  }

  const productName = document.getElementById('productName').value;
  const productDescription =
    document.getElementById('productDescription').value;
  const productPrice = document.getElementById('productPrice').value;
  const productOldPrice = document.getElementById('productOldPrice').value;
  const stocks = document.getElementById('stocks').value;
  const productCategory = document.getElementById('productCategory').value;

  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productOldPrice ||
    !stocks ||
    productCategory === 'Add to Category' || images.length ===0
  ) {
    callAlertify('warning', 'Please fill in all required fields');
    setTimeout(() => {
      submitButton.disabled = false;
    }, 3000);
    return;
  }

  const url = '/admin/add-products';
  submitButton.disabled = true;


  axios
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if(response.data.success){
        console.log('Product added successfully!');
        submitButton.disabled = false;
        callAlertify('success', response.data.message);
        // event.target.form.reset();
        // selectedImages = [];
        // images = []
        window.location.href = '/admin/products'
        document.getElementById('image-preview').innerHTML = '';
      }else{
        callAlertify('error',response.data.message)
        submitButton.disabled = false;
      }
    })
    .catch((error) => {
      console.log(error);
      callAlertify('error', 'something wrong internal server error');
      submitButton.disabled = false;
      console.error('Error adding product:', error);
    });
});

//add images
function imageSelect() {
  const imageInput = document.getElementById('productImage');
   selectedImages = imageInput.files;

  if (images.length + selectedImages.length > 4) {
    callAlertify('error', `You can only select 4 images`);
    imageInput.value = '';
    return;
  }
  for (i = 0; i < selectedImages.length; i++) {
    if (checkDuplicate(selectedImages[i].name)) {
      images.push({
        name: selectedImages[i].name,
        url: URL.createObjectURL(selectedImages[i]),
        file: selectedImages[i],
      });
    } else {
      callAlertify('warning', `${selectedImages[i].name} is already added`);
    }
  }
  // Clear the image preview before generating new HTML
  document.getElementById('image-preview').innerHTML = '';
  document.getElementById('image-preview').innerHTML = imageShow();
}


function imageShow() {
  let image = '';
  images.forEach((item) => {
    image += `<div class="image_container d-flex justify-content-center position-relative">
              <img src="${item.url}" alt="img">
              <span class="position-absolute" onclick="deleteImage(${images.indexOf(
                item
              )})">&times;</span>
            </div>`;
  });
  return image;
}

function deleteImage(index) {
  images.splice(index, 1);
  document.getElementById('image-preview').innerHTML = imageShow();
}

function checkDuplicate(name) {
  let img = true;
  if (images.length > 0) {
    for (j = 0; j < images.length; j++) {
      if (images[j].name === name) {
        img = false;
        break;
      }
    }
  }
  return img;
}
