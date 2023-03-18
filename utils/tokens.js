const { sign } = require('jsonwebtoken');

// sign access token
const createAccessToken = (id) => {
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 15 * 60,
  });
};

// sign refresh token
const createRefreshToken = (id) => {
  return sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '90d',
  });
};

// send access token to client
const sendAccessToken = (request, response, accessToken) => {
  response.json({
    accessToken,
    message: '!!! Sign in successful !!!',
    type: 'success',
  });
};

// send refresh token to client as cookie
const sendRefreshToken = (response, refreshToken) => {
  response.cookie('refresh_token', refreshToken, {
    httpOnly: true,
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};