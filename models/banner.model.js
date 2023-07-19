const bannerDatabase = require('../schema/banner.schema');
const cloudinary = require('../config/cloudinary');

async function getAllBanners() {
  try {
    const banners = await bannerDatabase.find().select('imageURL').exec();
    return banners || [];
  } catch (error) {
    throw new Error('Oops! Something went wrong while fetching banner images');
  }
}

async function addNewBanner(bannerData, bannerImage) {
  try {
    const { bannerNumber, title } = bannerData;
    let banner = await bannerDatabase.findOne({ bannerNumber: bannerNumber });

    if (!banner) {
      banner = new bannerDatabase({
        title: title,
        bannerNumber: bannerNumber,
      });
    } else {
      banner.title = title;
      // Delete the existing image from Cloudinary
      const existingImagePublicId = banner.imageURL.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(existingImagePublicId);
    }

    const path = bannerImage.path;

    let response = await cloudinary.uploader.upload(path, {
      transformation: [{ width: 966, height: 542, crop: 'crop' }],
      folder: `traction/banner_images/${bannerNumber}`,
      unique_filename: true,
    });

    banner.imageURL = response.url;
    const result = await banner.save();

    if (result) {
      return { status: true, message: 'Banner added/updated successfully' };
    } else {
      return { status: false, message: 'Failed to save the banner' };
    }
  } catch (error) {
    throw new Error('Oops! Something went wrong adding/updating the banner image');
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
