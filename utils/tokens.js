const { sign } = require("jsonwebtoken");

// sign access token
// time in seconds
const createAccessToken = (id) => {
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 20,
  });
};

// sign email validation token
const createValidationToken = (id) => {
  return sign({ id }, process.env.VALIDATION_TOKEN_SECRET, {
    expiresIn: 60 * 15,
  });
};

// sign refresh token
const createRefreshToken = (id) => {
  return sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "90d",
  });
};

// send access token to client
const sendAccessToken = (request, response, accessToken) => {
  response.status(200).json({
    accessToken,
    message: "Sign in successful @ auth/login",
    type: "200 OK",
  });
};

// send refresh token to client as cookie
const sendRefreshToken = (response, refreshToken) => {
  response.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

module.exports = {
  createAccessToken,
  createValidationToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};
