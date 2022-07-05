const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide valid name"],
  },
  email: {
    type: String,
    required: [true, "Please provide valid email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter correct email",
    ],
  },
  password: {
      type: String,
      required: [true, "Please enter valid password"],
      minlength: 6,
      select: false,
  },
  userStatus: {
    type: String,
    required: true,
  },
  otpToken: {
    type: String,
    unique: true,
  },
  createdAt: Date,
  otpTokenExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function(next) {

    const salt = await bcrypt.genSalt(10);
    if(this.isModified("password")){
      this.password = await bcrypt.hash(this.password, salt);
    }
    if(this.isModified("otpToken") && this.otpToken !== undefined){
      this.otpToken = await bcrypt.hash(this.otpToken, salt);
    }
    next();
})

userSchema.methods.getSignedToken = function () {
  return jwt.sign({userId: this.id, username: this.username, email: this.email}, process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    })
}

userSchema.methods.matchPassword = async function(password){
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.matchOtp = async function(otpToken) {
  return await bcrypt.compare(otpToken, this.otpToken);
}

userSchema.methods.getResetPasswordToken = async function(){
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (6*10000);
  
  return resetToken;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
