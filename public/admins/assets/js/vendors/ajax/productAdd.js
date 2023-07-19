
//test 
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
  const productDescription = document.getElementById('productDescription').value;
  const productPrice = document.getElementById('productPrice').value;
  const productOldPrice = document.getElementById('productOldPrice').value;
  const stocks = document.getElementById('stocks').value;
  const productCategory = document.getElementById('productCategory').value;
  const featured = document.getElementById('featured').value;
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

  function validateImage(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!allowedTypes.includes(file.type)) {
      swal('Error', 'Only JPEG, JPG and PNG images are allowed', 'error');
      return false;
    }
    if (file.size > maxSize) {
      swal('Error', 'The image size should be within 2MB', 'error');
      return false;
    }
    return true;
  }

  for (let i = 0; i < images.length; i++) {
    if (!validateImage(images[i].file)) {
      submitButton.disabled = false;
      return;
    }
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
              <img id="imageShow${images.indexOf(
                item
              )}" src="${item.url}" alt="img">
              <span class="position-absolute" onclick="deleteImage(${images.indexOf(
                item
              )})">&times;</span>
              <span class="position-absolute edit-icon " data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="changeImage(${images.indexOf(
                item
              )})">&#9998;</span>
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


function changeImage(index){
  const imageElement = new Image();
  imageElement.src = images[index].url;
  imageElement.classList.add('crop_image');

  const cropContainer = document.getElementById("imageContainer");
  cropContainer.innerHTML = '';

  imageElement.onload = function() {
  const cropper = new Cropper(imageElement, {
    autoCrop: true,
    autoCropArea: 0.8, 
    // aspectRatio: 16 / 9, 
    responsive: true, 
    minContainerWidth:467,
    minContainerHeight:467,
  });

  cropContainer.appendChild(imageElement);

  const cropButton = document.getElementById("cropButton");

  cropButton.addEventListener("click", function() {
     const canvas = cropper.getCroppedCanvas();

     let imageInThePage = document.getElementById(`imageShow${index}`);
      imageInThePage.src =  cropper.getCroppedCanvas().toDataURL('image/jpeg');

    canvas.toBlob(function(blob) {
      const croppedFile = new File([blob], images[index].name, { type: blob.type });
      const inputFile = new DataTransfer();
      inputFile.items.add(croppedFile);
      images[index].file = inputFile.files[0];
    }, images[index].type);


    var modal = document.getElementById('exampleModal');
    $(modal).modal('hide');

  });
}}