const User = require("../models/User");
const ErrorResponse = require("../utils/errorRes");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res, next) => {
  // const find = await User.findOne({ where: { email: req.body.email } });
  // if (find) {
  //   return next(new ErrorResponse("User already registered", 400));
  // } else
   {
    const { username, email, password } = req.body;
    try {
      const user = await User.create({
        username,
        email,
        password,
      });
      sendToken(user, 201, res);
    } catch (error) {
      next(error);
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.json({msg:"Incorrect username or password.", status:false});
    }
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return res.json({msg:"Incorrect username or password.", status:false});
    }
    const username = await User.findOne({email});
    sendToken(user, 200, res,username);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `
      <h1>You have requested a Password RESET</h1>
      <p>Please click on this link to RESET your Password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: "PASSWORD RESET",
        text: message,
      });
      res.status(200).json({
        success: true,
        data: "EMAIL SENT",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(201).json({
      success: true,
      data: "Password Reset Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res ,username) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token ,user,username});
};
