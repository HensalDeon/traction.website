
const {
  checkUserWithEmail,
  checkUserExistOrNot,
  verifyPhoneNumber,
  sendVerificationSignup,
  submitSignup,
  updateUserData,
  resetPassword,
} = require('../models/userAuth.model');

const { fetchAllProducts } = require('../models/product.model');
const { fetchUserOrderDetails, getOrderdetails } = require('../models/order.model');
const { generateInvoice } = require('../config/pdfKit');

const {getAllBanners} = require('../models/banner.model')

const { handleError } = require('../middlewares/error.handler');
const { signupSchema, updateUserSchema, resetPasswordSchema } = require('../config/joi');

async function GetHome(req, res) {
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

async function GetLogin(req, res) {
  try {
    res.render('user/logins/login');
  } catch (error) {
    handleError(res, error);
  } 
}

async function PostLoginVerify(req, res) {
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
function GetOtpLogin(req, res) {
  try {
    res.render('user/logins/otp-login');
  } catch (error) {
    handleError(res, error);
  }
}

async function LoginVerifyPhone(req, res) {
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

async function VerifyPhone(req, res) {
  const { phone } = req.body;
  console.log(phone + '📞');
  try {
    const  result = await checkUserExistOrNot(phone)
    if(result.status) {
      return res.status(200).json(result)
    }else{
      return res.status(400).json(result)
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function GetOtpVerify(req, res) {
  try {
    const phone = req.session.phone;
    return res.render('user/logins/otp-verify', { phone });
  } catch (error) {
    handleError(res, error);
  }
}

async function PostVerifyOtp(req, res) {
  try {
    const phone = req.session.phone;
    const { otp } = req.body;
    const response = await verifyPhoneNumber(phone, otp);
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

async function VerifyOtp(req, res) {
  try {
    const { otp, phone } = req.body;
    const response = await verifyPhoneNumber(phone, otp);
    if (response.status) {
      return res.json({ status: true });
    } else {  
      return res.json({ status: false });
    }
  } catch (error) {
    handleError(res, error);
  }
}

//sign up
async function GetSignup(req, res) {
  try {
    res.render('user/logins/signup');
  } catch (error) {
    handleError(res, error);
  }
}

async function SignupOtpVerify(req, res) {
  try {
    const { phone } = req.body;
    const phoneExist = await sendVerificationSignup(phone);
    if (!phoneExist) {
      res.send({status: false});
    } else {
      res.send({status: true});
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function PostSignup(req, res) {
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

async function GetAccount(req, res) {
  try {
    const userData = req.session?.user;
    if (userData) {
      const orders = await fetchUserOrderDetails(req.session.user._id, res);
      return res.render('user/account', {
        userData: userData,
        orders: orders.orderDetails,
        addresses: orders.addresses,
      });
    }
    return res.render('user/account', { userData });
  } catch (error) {
    handleError(res, error);
  }
}

async function PostResetPassword(req, res) {
  try {
    const { phone, password } = req.body;
    const { error } = resetPasswordSchema.validate({password});
    if (error) {
      return res.status(400).json({ status: false, message: error.details[0].message });
    }
    const updatePassword = await resetPassword(phone, password);
    if (updatePassword.status) {
      // Handle successful password reset scenario
      return res.json({ status: true, message: 'Password reset successfully' });
    } else {
      return res.json({ status: false, message: 'Failed to reset password' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function UpdateUserdata(req, res) {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: false, message: error.details[0].message });
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

function GetLogout(req, res) {
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (error) {
    handleError(res, error);
  }
}

function Get404(req, res) {
  try {
    res.status(404).render('user/404');
  } catch (error) {
    handleError(res, error);
  }
}
async function  GetForgotPassword(req, res) {
  try {
    res.render('user/logins/forgot-password');
  } catch (error) {
    handleError(res, error);
  }
}

async function Particle(req, res){
  try {
    res.render('user/particle')
  } catch (error) {
    handleError(res, error)
  }
}
// .................................................
async function GetInvoice(req, res) {
  try {
    let id = req.query.id
    const invoiceData = await getOrderdetails(id);
     generateInvoice(invoiceData, res);
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  GetHome,
  GetSignup,
  GetLogin,
  PostLoginVerify,
  VerifyPhone,
  GetOtpLogin,
  LoginVerifyPhone,
  GetOtpVerify,
  PostVerifyOtp,
  VerifyOtp,
  SignupOtpVerify,
  PostSignup,
  UpdateUserdata,
  GetAccount,
  GetLogout,
  Get404,
  GetForgotPassword,
  PostResetPassword,
  Particle,
  GetInvoice
};
