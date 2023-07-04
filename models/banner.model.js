const bannerDatabase = require('../schema/banner.schema');
const cloudinary = require('../config/cloudinary');

async function getAllBanners() {
  try {
    const banners = await bannerDatabase.find({bannerNumber:1}).select('imageURL').exec();
    return banners;
  } catch (error) {
    throw new Error('Oops! Something went wrong while fetching banner images');
  }
}

async function addNewBanner(bannerData, bannerImage) {
  try {
    const { title, startDate, endDate, bannerNumber } = bannerData;
    const banner = new bannerDatabase({
      title: title,
      // startDate: startDate,
      // endDate: endDate,
      bannerNumber: bannerNumber,
    });

    const path = bannerImage.path;

    let response = await cloudinary.uploader.upload(path, {
      transformation: [{ width: 966, height: 542, crop: 'crop' }],
      folder: `traction/banner_images/${bannerNumber}`,
      unique_filename: true,
    });

    banner.imageURL = response.url;
    const result = await banner.save();
    if (result) {
      return { status: true, message: 'banner added successfully' };
    } else {
      return { status: false, message: 'banner failed to save' };
    }
  } catch (error) {
    throw new Error('Oops! Something went wrong adding banner image');
  }
}


async function updateBanner(bannerData, bannerImage) {
  try {
    const { title, bannerId } = bannerData;

    const banner = await bannerDatabase.findById(bannerId);

    if (!banner) {
      return { status: false, message: 'Banner not found' };
    }

    if (title) {
      banner.title = title;
    }

    if (bannerImage && bannerImage.path) {
      const response = await cloudinary.uploader.upload(bannerImage.path, {
        transformation: [{ width: 966, height: 542, scale: 'fit' }],
        folder: `traction/banner_images/${1}`,
        unique_filename: true,
      });

      banner.imageURL = response.url;
    }

    const result = await banner.save();

    if (result) {
      return { status: true, message: 'Banner updated successfully' };
    } else {
      return { status: false, message: 'Failed to update banner' };
    }
  } catch (error) {
    console.error(error);
    throw new Error('Oops! Something went wrong updating the banner data');
  }
}



module.exports = { getAllBanners, addNewBanner,updateBanner };
