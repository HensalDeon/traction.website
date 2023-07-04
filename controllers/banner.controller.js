const { getAllBanners, addNewBanner ,updateBanner} = require('../models/banner.model');
const { handleError } = require('../middlewares/error.handler');

async function GetBannerPage(req, res) {
  try {
    const banners = await getAllBanners();
    res.render('admin/banners', { banners: banners, activePage: 'banners' });
  } catch (error) {
    handleError(res, error);
  }
}

async function AddBanner(req, res) {
  try {
    
    const result = await addNewBanner(req.body, req.file);
    if (result.status) {
      return res.redirect('/admin/banners');
    } else {
      return res.redirect('/admin/banners');
    }
  } catch (error) {
    handleError(res, error);
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
