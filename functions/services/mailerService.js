const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your code is: ${code}`
  };

  await transporter.sendMail(mailOptions);
};