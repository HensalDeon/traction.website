const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    console.log(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
}); 

//file validation
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    const error = new Error('Only JPEG and PNG images are allowed!');
    error.status = 400; 
    return cb(error, false);
  }

  // Check file size
  if (file.size > 1024 * 1024) {
    const error = new Error('File size exceeds the limit of 1MB!');
    error.status = 400;
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2* 1024 * 1024 }, // 1MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
