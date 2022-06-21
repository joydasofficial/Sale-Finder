const express = require("express");
const router = express.Router();

const {
    register,
    login,
    forgotPassword,
    resetPassword,
    verifyUser,
} = require("../controllers/auth");

router.route("/register").post(register);

router.route("/verifyuser").post(verifyUser);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resetToken").put(resetPassword);

module.exports = router;
