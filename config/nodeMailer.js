const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'clara.ebert53@ethereal.email',
        pass: 'xUu1AMjPw2dgJzcJZJ'
    }
});

module.exports = transporter;
