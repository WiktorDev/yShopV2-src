const nodemailer = require('nodemailer');
const config = require('../config/config')
const logger = require('../utils/logger')

exports.sendMail=(email, subject, htmlData)=>{
  let transporter = nodemailer.createTransport({
    pool: true,
    host: config.mail_host,
    port: 587,
    secure: true,
    auth: {
      user: config.mail_user, 
      pass: config.mail_pass, 
    }
  });
  var mailOptions = {
    from: 'system@yshop.pl',
    to: email,
    subject: subject,
    html: htmlData
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      logger.error(error)
    } else {
      logger.info('Email zostal wyslany: ' + info.response)
    }
  })
}


