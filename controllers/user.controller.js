const {
  checkUserWithEmail,
  checkUserExistOrNot,
  verifyPhoneNumber,
  sendVerificationSignup,
  submitSignup,
  updateUserData,
} = require('../models/userAuth.model');

const { fetchAllProducts } = require('../models/product.model');
// const { fetchUserOrderDetails } = require('../models/order.model');
const {getAllBanners} = require('../models/banner.model')

const { handleError } = require('../middlewares/error.handler');
const { signupSchema, updateUserSchema } = require('../config/joi');

async function httpGetHome(req, res) {
  try {
    const productResult = await fetchAllProducts();
    const banner = await getAllBanners();
    if (productResult) {
      res.status(200).render('user/home', {
        products: productResult.products,
        status: true,
        banner:banner
      });
    } else {
      res.status(500).json({ status: false });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetLogin(req, res) {
  try {
    res.render('user/logins/login');
  } catch (error) {
    handleError(res, error);
  } 
}

async function httpPostLoginVerify(req, res) {
  const { email, password } = req.body;
  try {
    const userResult = await checkUserWithEmail(email, password);
    if (userResult?.status) {
      req.session.userloggedIn = true;
      req.session.user = userResult.user;
      res.status(200).redirect("/")
    } else {
      res.json({ status: false, message: userResult?.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

//otp login
function httpGetOtpLogin(req, res) {
  try {
    res.render('user/logins/otp-login');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpLoginVerifyPhone(req, res) {
  const { phone } = req.body;
  console.log(phone + '📞');
  try {
   
    const  result = await checkUserExistOrNot(phone)
    if(result.status) {
      req.session.phone = phone 
      return res.status(200).json(result)
    }else{
      return res.status(400).json(result)
    }
   
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetOtpVerify(req, res) {
  try {
    console.log("entered");
    const phone = req.session.phone;
    return res.render('user/logins/otp-verify', { phone });
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostVerifyOtp(req, res) {
  try {
    console.log("hello world")
    const phone = req.session.phone;
    const { otp } = req.body;
    const response = await verifyPhoneNumber(phone, otp);
    console.log(response)
    if (response.status) {
      req.session.userloggedIn = true;
      req.session.user = response.user;
      return res.json({ status: true });
    } else {  
      return res.json({ status: false });
    }
  } catch (error) {
    handleError(res, error);
  }
}

//sign up
async function httpGetSignup(req, res) {
  try {
    res.render('user/logins/signup');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpSignupOtpVerify(req, res) {
  try {
    const { phone } = req.body;
    const phoneExist = await sendVerificationSignup(phone);
    if (!phoneExist) {
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function httpPostSignup(req, res) {
  try {
    const validation = signupSchema.validate(req.body, {
      abortEarly: false,
    });
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }
    const { status, user, message } = await submitSignup(req.body);
    if (!status) {
      return res.status(400).json({ error: message, status });
    }
    req.session.user = user;
    req.session.userloggedIn = true;

    return res.json({ status: true });
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGetAccount(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const userData = req.session?.user;
    // if (userData) {
    //   const orders = await fetchUserOrderDetails(req.session.user._id, res,page,limit);
    //   return res.render('user/account', {
    //     userData: userData,
    //     orders: orders.orderDetails,
    //     addresses: orders.addresses,
    //     totalPages:orders.totalPages,
    //     currentPage:orders.currentPage,
    //     limit: orders.limit,
    //   });
    // }
    return res.render('user/account', { userData });
  } catch (error) {
    handleError(res, error);
  }
}

async function httpUpdateUserdata(req, res) {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const updateResult = await updateUserData(value, req.file, req.session.user._id);
    if (updateResult.status) {
      if(updateResult.user){
       req.session.user =  updateResult.user
      }
      return res.json({status:true, message: updateResult?.message });
    } else {
      return res.json({status:false, message: updateResult?.message });
    }
  } catch (error) {
    handleError(res, error);
  }
}

function httpGetLogout(req, res) {
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (error) {
    handleError(res, error);
  }
}

function httpGet404(req, res) {
  try {
    res.status(404).render('user/404');
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  httpGetHome,
  httpGetSignup,
  httpGetLogin,
  httpPostLoginVerify,
  httpGetOtpLogin,
  httpLoginVerifyPhone,
  httpGetOtpVerify,
  httpPostVerifyOtp,
  httpSignupOtpVerify,
  httpPostSignup,
  httpUpdateUserdata,
  httpGetAccount,
  httpGetLogout,
  httpGet404,
};
