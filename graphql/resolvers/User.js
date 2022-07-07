const User = require("../../models/User.model");
const ErrorResponse = require("../../utils/errorResponse");
const sendEmail = require('../../utils/sendEmail');
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const {UserInputError} = require('apollo-server');

module.exports = {
    Query: {
       
    },
    Mutation: {
        async register(_, {input: {username, email, password, cpassword, mobile}}, context, info){
            try {
                const userStatus = "pending";
                const otpToken = Math.floor(100000 + Math.random() * 900000);
                const otpTokenExpire = Date.now() + 10 * (6*100000);

                const alreadyRegistered = await User.findOne({email});
                if(alreadyRegistered){
                  throw new UserInputError('User already exist',{
                    error: {
                      email: 'User already exist'
                    }
                  })
                }

                if(password !== cpassword){
                  throw new UserInputError('Password doesnt match',{
                    error: {
                      password: 'Password does not match'
                    }
                  }) 
                }
            
                const user = await User.create({
                  username,
                  email,
                  password,
                  mobile,
                  userStatus,
                  otpToken,
                  otpTokenExpire,
                  createdAt: Date.now(),
                });
            
                const token = authToken(user);
            
                const message = `<h1>Please verify your email</h1>
                <p>Enter the following otp to verify your email</p>
                <h1>${otpToken}</h1>`;
            
                try {
                  await sendEmail({
                    to: email,
                    subject: "Email verification otp",
                    text: message,
                  })
            
                  return {
                    ...user._doc,
                    id: user.__id,
                    token
                  }
                } catch (error) {
                    return error;
                }
            
              } catch (error) {
                  return error;
              }
        },
        async verifyUser(_, {email, otpToken}){
          try {
            const user = await User.findOne({email, otpTokenExpire : { $gt : Date.now()}});
            
            if(!user){
              throw new UserInputError('User not found',{
                error: {
                  user: 'User not found'
                }
              })
            }
        
            const isOtpMatch = await user.matchOtp(otpToken);
        
            if(!isOtpMatch){
              throw new UserInputError('OTP is not valid',{
                error: {
                  otpToken: 'OTP not valid'
                }
              })
            }
        
            user.userStatus = "verified";
            user.otpToken = undefined;
            user.otpTokenExpire = undefined;
        
            const verifiedUserData = await user.save();
        
            return {
              ...verifiedUserData._doc,
              id: verifiedUserData.__id,
            }

          } catch (error) {
              throw new Error(error);
          }
        },
        async login(_, {email, password}){              
          try {
            if(!email || !password){
              throw new UserInputError('Email and password cant be empty',{
                error: {
                  email: 'Email and password cant be null'
                }
              })
            }

            const user = await User.findOne({email}).select("+password");

            if(!user){
              throw new UserInputError('Invalid Credentials', {
                error: {
                  email : 'Invalid Credentials'
                }
              })
            }

            const isMatch = await user.matchPassword(password);

            if(!isMatch){
              throw new UserInputError('Invalid Credentials', {
                error: {
                  password : 'Invalid Credentials'
                }
              })
            }

            const token = authToken(user);

            return {
              ...user._doc,
              id: user.__id,
              token
            }
          } catch (error) {
              throw new Error(error);
          }
        },
        async forgotPassword(_, {email}){
          try {
            if(!email){
              throw new UserInputError('Email cannot be empty',{
                error: {
                  email: 'Email cant be empty'
                }
              })
            }
        
            const user = await User.findOne({email});
        
            if(!user){
              throw new UserInputError('User not found',{
                error: {
                  email: 'User not found'
                }
              })
            }
        
            const resetPasswordToken = await user.getResetPasswordToken();
        
            await user.save();
        
            const resetURL = `http://localhost:3000/passwordreset/${resetPasswordToken}`;
            const message = `
            <h1>You have requested for password reset</h1>
            <p>Please follow this link to reset the password</p>
            <a href=${resetURL} clicktracking=off>${resetURL}</a>`;
        
            try {
              await sendEmail({
                to: user.email,
                subject: "Password reset request",
                text: message,
              })
        
              return {message: 'Email sent, please check your inbox', email: user.email}
            } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
        
                await user.save();
        
                throw new Error('Email could not be sent')
            }
          } catch (error) {
            throw new Error(error)
          }
        },
        async resetPassword(_, {resetToken, email, password, cpassword}){
          //when frontend is ready check email usage once
          const resetTokenCheck = crypto.createHash("sha256").update(resetToken).digest("hex");
            try {
              if(!resetToken){
                throw new UserInputError('Empty token', {
                  error: {
                    token: 'Please enter token'
                  }
                })
              }

              const user = await User.findOne({
                email,
                resetToken:resetTokenCheck,
                resetPasswordExpire : {$gt : Date.now()}
              })

              if(!user){
                throw new UserInputError('Invalid Token', {
                  error: {
                    token: 'Invalid Token'
                  }
                })
              }

              if(password !== cpassword){
                throw new UserInputError('Password does not match', {
                  error: {
                    password: 'Password does not match'
                  }
                })
              }

              user.password = password;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpire = undefined;

              const userData = await user.save();

              return {
                ...userData._doc,
                id: userData.__id,
                message: 'Password changed sucessfully'
              }
            } catch (error) {
              throw new Error(error)
            }
        }
    }
}

const authToken = (user) => {
  const token = user.getSignedToken();
  return token;
};
