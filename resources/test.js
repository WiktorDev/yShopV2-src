const nodemailer = require("nodemailer");
const ejs = require("ejs");

let transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.wp.pl",
  port: 465,
  secure: true,
  auth: {
    user: "wiktor101a@wp.pl", 
    pass: "rXXX", 
  }
});
ejs.renderFile(__dirname + "/activate.ejs", { username: 'Stranger', code: '34567' }, function (err, data) {
  if (err) {
      console.log(err);
  } else {
      var mailOptions = {
        from: 'wiktor101a@wp.pl',
        to: 'mcserw4@wp.pl',
        subject: 'Aktywacja konta yShop.pl',
        html: data
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error)
        } else {
          console.log('Email zostal wyslany: ' + info.response)
        }
      })
  }
});
