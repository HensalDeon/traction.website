const { handleError } = require('../middlewares/error.handler');

function GetAbout(req,res) {
    try {
        res.status(200).render('user/about');
    } catch (error) {
        handleError(res, error);
    }
}

function GetContact(req, res){
    try{
        res.status(200).render('user/contact');
    }catch(error){
        handleError(res, error);
    }
}

function GetLearnMore(req, res){
    try {
        res.status(200).render('user/logins/privacy-policy.ejs')
    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { GetAbout, GetContact, GetLearnMore }