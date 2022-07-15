const nodemailer = require("nodemailer");
        // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // create reusable transporter object using the default SMTP transport
  async function main(email,otp) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'quanglnFX13841@funix.edu.vn', // generated ethereal user
      pass: 'La242119@', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: 'quanglnFX13841@funix.edu.vn', // sender address
    to: email, // list of receivers
    subject: "welcome to abc.com", // Subject line
    text: "Chào mừng bạn đến với abc.com mã xác thực của bạn là :" + otp +" mã xác thực có giá trị trong 5 phút" , // plain text body
    html: "<b>Chào mừng bạn đến với abc.com mã xác thực của bạn là :" + otp +" mã xác thực có giá trị trong 5 phút</b>", // html body
  });
}
  exports.sendmail =  main;