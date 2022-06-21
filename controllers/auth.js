// const User = require("../models/User.model");
// const ErrorResponse = require("../utils/errorResponse");
// const sendEmail = require('../utils/sendEmail');
// const crypto = require("crypto");
// const bcrypt = require("bcrypt");

// exports.register = async (req, res, next) => {
//   const { username, email, password } = req.body;

//   try {
//     const userStatus = "pending";
//     const otpToken = Math.floor(100000 + Math.random() * 900000);
//     const otpTokenExpire = Date.now() + 10 * (6*10000);

//     const user = await User.create({
//       username,
//       email,
//       password,
//       userStatus,
//       otpToken,
//       otpTokenExpire,
//     });

//     authToken(user, 201, res);

//     const message = `<h1>Please verify your email</h1>
//     <p>Enter the following otp to verify your email</p>
//     <h1>${otpToken}</h1>`;

//     try {
//       await sendEmail({
//         to: email,
//         subject: "Email verification otp",
//         text: message,
//       })

//       res.status(200).json({
//         success: true,
//         message: "Verification email sent",
//       })
//     } catch (error) {
//         return next(error);
//     }

//   } catch (error) {
//       next(new ErrorResponse("Registration Failed", 400));
//   }
// };

// exports.verifyUser = async (req, res, next) => {
//   let {otpToken, email} = req.body;
//   try {
//     const user = await User.findOne({email, otpTokenExpire : { $gt : Date.now()}});

//     if(!user){
//       return next(new ErrorResponse("User not found", 404));
//     }

//     const isOtpMatch = user.matchOtp(otpToken);

//     if(!isOtpMatch){
//       return next(new ErrorResponse("Invalid/Expired OTP", 400));
//     }

//     user.userStatus = "verified";
//     user.otpToken = undefined;
//     user.otpTokenExpire = undefined;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "User successfully verified"
//     })
//   } catch (error) {
//     return next(new ErrorResponse("User verification failed", 500));
//   }
// }

// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     if(!email || !password){
//       return next(new ErrorResponse("Please enter email and password", 400));
//     }

//     const user = await User.findOne({email}).select("+password");

//     if(!user){
//       return next(new ErrorResponse("Invalid Credentials", 404));
//     }

//     const isMatch = await user.matchPassword(password);

//     if(!isMatch){
//       return next(new ErrorResponse("Invalid Credentials", 401));
//     }

//     authToken(user, 200, res);
//   } catch (error) {
//     next(new ErrorResponse("Login Failed", 400));
//   }
// };

// exports.forgotPassword = async (req, res, next) => {
//   const {email} = req.body;

//   try {
//     if(!email){
//       return next(new ErrorResponse("Please enter an email", 400));
//     }

//     const user = await User.findOne({email});

//     if(!user){
//       return next(new ErrorResponse("User not found", 401));
//     }

//     const resetPasswordToken = await user.getResetPasswordToken();

//     await user.save();

//     const resetURL = `http://localhost:3000/passwordreset/${resetPasswordToken}`;
//     const message = `
//     <h1>You have requested for password reset</h1>
//     <p>Please follow this link to reset the password</p>
//     <a href=${resetURL} clicktracking=off>${resetURL}</a>`;

//     try {
//       await sendEmail({
//         to: user.email,
//         subject: "Password reset request",
//         text: message,
//       })

//       res.status(200).json({
//         success: true,
//         message: "Email sent"
//       });
//     } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;

//         await user.save();

//         return next(new ErrorResponse("Email could not be sent", 500));
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// exports.resetPassword = async (req, res, next) => {
//   const resetToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

//   try {
//     const user = await User.findOne({
//       resetToken,
//       resetPasswordExpire : {$gt : Date.now()}
//     })

//     if(!user){
//       return next(new ErrorResponse("Invalid Token"));
//     }

//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password reset successfull"
//     })
//   } catch (error) {
//     return next(error);
//   }
// };

// const authToken = (user, statusCode, res) => {
//   const token = user.getSignedToken();
//   res.status(statusCode).json({
//     success: true,
//     token,
//   });
// };
