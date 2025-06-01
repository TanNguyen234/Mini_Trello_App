const jwt = require("jsonwebtoken");
const { generateCode } = require("../utils/generateCode");
const {
  createUser,
  findUserByEmail,
  saveVerificationCode,
  verifyCode
} = require("../services/userService");
const { sendVerificationCode } = require("../services/mailerService");

exports.signUp = async (req, res) => {
  const { email } = req.body;
  const code = generateCode();
  await saveVerificationCode(email, code);
  await sendVerificationCode(email, code);
  res.status(200).json({ message: "Verification code sent" });
};

exports.signIn = async (req, res) => {
  const { email, verificationCode } = req.body;

  const isValid = await verifyCode(email, verificationCode);
  if (!isValid) return res.status(401).json({ error: "Invalid verification code" });
  
  let user = await findUserByEmail(email);
  if (!user) {
    user = await createUser(email);
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d"
  });

  res.status(200).json({ accessToken: token });
};

exports.getProfile = async (req, res) => {
  try {
    console.log(user)
    const user = req.user;
    res.status(200).json({
      id: user.id,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve user info" });
  }
};
