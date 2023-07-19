const { getAllBanners, addNewBanner ,updateBanner} = require('../models/banner.model');
const { handleError } = require('../middlewares/error.handler');

async function GetBannerPage(req, res) {
  try {
    const banners = await getAllBanners();
    res.render('admin/banners', { banners: banners || [], activePage: 'banners' });
    if(banners.lenght === 0){

    }
  } catch (error) {
    handleError(res, error);
  }
}

async function AddBanner(req, res) {
  try {

    const result = await addNewBanner(req.body, req.file);
    if (result.status) {
      return res.status(200).json({ status: true, message: "Banner added/updated successfully" });
    } else {
      return res.status(200).json({ status: false, message: "Failed to save the banner" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: "Oops! Something went wrong adding/updating the banner image" });
  }
}

async function EditBanner(req, res) {
  try {
    const result =  await updateBanner(req.body,req.file);
    if (result.status) {
      return res.redirect('/admin/banners');
    } else {
      return res.redirect('/admin/banners');
    }
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = { GetBannerPage, EditBanner, AddBanner };
