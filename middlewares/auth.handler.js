//! user
function isLoggedIn(req, res, next) {
  if (req.session.userloggedIn) {
    next();
  } else {
       res.redirect('/login');
  }
}

function isLoggedOut(req, res, next) {
  if (!req.session.userloggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}

// !admin
function isAdminLoggedIn(req, res, next) {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

function isAdminLoggedOut(req, res, next) {
if (!req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect('/admin');
  }
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdminLoggedIn,
  isAdminLoggedOut,
};
