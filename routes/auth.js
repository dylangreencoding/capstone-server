const express = require("express");
const router = express.Router();

// middleware for protected route
const { protected } = require("../utils/protected");

const {
  createAccount,
  resendValidationEmail,
  validateEmail,
  login,
  logout,
  refreshTokens,
  getUserAssets,
} = require("../end-ware/for-auth");

router.post("/create-account", createAccount);
router.post("/resend-validation-email", resendValidationEmail);
router.post("/validate-email", validateEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh_token", refreshTokens);

// main protected route
// returns user data
router.get("/protected", protected, getUserAssets);

module.exports = router;
