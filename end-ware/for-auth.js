// END-WARE FOR /auth ROUTES

// for hashing and comparing passwords
const { hash, compare } = require("bcryptjs");
// for getting new access token using refresh token
const { verify } = require("jsonwebtoken");

// database operations
const {
  searchUsers,
  addUser,
  addRefresh,
  updateValidationCode,
  updatePassword,
  findById,
} = require("../harperDB/users-table");
const { getAllMaps } = require("../harperDB/maps-table");
const { getAllChars } = require("../harperDB/characters-table");
const { getAllGames } = require("../harperDB/games-table");

// tokens
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  createValidationToken,
} = require("../utils/tokens");

// nodemailer
const { asyncSendMail } = require("../utils/email");

const createAccount = async (request, response) => {
  try {
    // destructure client request
    const { name, birthYear, email, password } = request.body;

    // check if user exists
    let user = await searchUsers(email);

    // if user exists, return error
    if (user.length !== 0) {
      return response.status(400).json({
        message: `User email already on record @ auth/create-account`,
        type: "400 Bad Request",
      });
    }

    // if user doesn't exist, create new user
    // hash (encrypt) the pw
    const passwordHash = await hash(password, 10);
    // save user to db
    await addUser(name, birthYear, email, passwordHash);

    // return response if successful
    return response.status(200).json({
      message: "User account created successfully @ auth/create-account",
      type: "200 OK",
    });
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error creating user account @ auth/create-account",
      error,
      data: request.body,
    });
  }
};

const resendValidationEmail = async (request, response) => {
  try {
    const { email } = request.body;

    // find user
    const user = await searchUsers(email);

    // if user not in db, return error
    if (user.length === 0) {
      return response.status(404).json({
        message: "User email not on record @ auth/resend-validation-email",
        type: "404 Not Found",
      });
    }

    // add validation code to user in db
    const validationCode = createValidationToken(user[0].id);
    await updateValidationCode(user[0].id, validationCode);

    //send validation code to user email
    try {
      const emailInfo = await asyncSendMail(user[0], validationCode);
      console.log(emailInfo);

      return response.status(200).json({
        message: "Email sent successfully @ auth/resend-validation-email",
        type: "200 OK",
      });
    } catch {
      return response.status(502).json({
        message: "Failed to send email @ auth/resend-validation-email",
        type: "502 Bad Gateway",
      });
    }
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error @ auth/resend-validation-email",
      error,
    });
  }
};

const validateEmail = async (request, response) => {
  try {
    const { validationCode, password } = request.body;

    // if no validation token, return error
    if (!validationCode) {
      return response.status(400).json({
        message: "No verification code @ auth/validate-email",
        type: "400 Bad Request",
      });
    }

    // if validation token, verify
    let id;
    try {
      id = verify(validationCode, process.env.VALIDATION_TOKEN_SECRET).id;
      // HERE
    } catch (error) {
      return response.status(400).json({
        message: "Invalid verification code @ auth/validate-email",
        type: "400 Bad Request",
      });
    }
    // if validation token invalid, return error
    if (!id) {
      return response.status(400).json({
        message: "Invalid verification code @ auth/validate-email",
        type: "400 Bad Request",
      });
    }

    // if validation token valid, find user
    let user = await findById(id);

    // if user doesn't exist, return error
    if (user.length === 0) {
      return response.status(404).json({
        message: "User email not on record @ auth/validate-email",
        type: "404 Not Found",
      });
    }

    // if user exists, update password
    // hash (encrypt) the pw
    const passwordHash = await hash(password, 10);
    // save new password to db
    await updatePassword(user[0].id, passwordHash);

    // validate
    await updateValidationCode(user[0].id, "");

    // send response
    return response.status(200).json({
      message: "Email verified successfully @ auth/validate-email",
      type: "200 OK",
    });
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error verifying email @ auth/validate-email",
      error,
    });
  }
};

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    // find user
    const user = await searchUsers(email);

    // if user not in db, return error
    if (user.length === 0) {
      return response.status(404).json({
        message: "User email not on record @ auth/login",
        type: "404 Not Found",
      });
    }

    // if account has not been validated, return error
    // if (user[0].validationCode !== '') {
    //   return response.status(401).json({
    //     message: 'User email has not been verified @ auth/login',
    //     type: '401 Unauthorized',
    //   });
    // }

    // if user exists, check if password is correct
    const passwordMatch = await compare(password, user[0].password);

    // if password incorrect, return error
    if (!passwordMatch) {
      return response.status(401).json({
        message: "Incorrect password @ auth/login",
        type: "401 Unauthorized",
      });
    }

    // if password correct, create tokens
    const accessToken = createAccessToken(user[0].id);
    const refreshToken = createRefreshToken(user[0].id);

    // add refresh token to user table
    await addRefresh(user[0].id, refreshToken);

    // send response
    sendRefreshToken(response, refreshToken);
    sendAccessToken(request, response, accessToken);
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error logging in @ auth/login",
      error,
    });
  }
};

const logout = (request, response) => {
  // clear cookie...
  response.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return response.status(200).json({
    message: "Logged out successfully @ auth/logout",
    type: "200 OK",
  });
};

const refreshTokens = async (request, response) => {
  try {
    const { refresh_token } = request.cookies;

    // if no refresh token, return error
    if (!refresh_token) {
      return response.status(401).json({
        message: "No refresh token  @ auth/refresh_token",
        type: "401 Unauthorized",
      });
    }

    // if refresh token, verify
    let id;
    try {
      id = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET).id;
      console.log(id);
      // HERE
    } catch (error) {
      return response.status(401).json({
        message: "Invalid refresh token  @ auth/refresh_token",
        type: "401 Unauthorized",
      });
    }

    // if refresh token invalid, return error
    if (!id) {
      return response.status(401).json({
        message: "Invalid refresh token @ auth/refresh_token",
        type: "401 Unauthorized",
      });
    }

    // if refresh token valid, find user
    const user = await findById(id);

    // if user does not exist, return error
    if (user.length === 0) {
      return response.status(404).json({
        message: "User email not on record @ auth/refresh_token",
        type: "404 Not Found",
      });
    }

    // if user exists, check if refresh tokens match
    // if incorrect, return error
    if (user[0].refresh_token !== refresh_token) {
      return response.status(401).json({
        message: "Invalid refresh token @ auth/refresh_token",
        type: "401 Unauthorized",
      });
    }

    // if refresh token correct, create new tokens
    const accessToken = createAccessToken(user[0].id);
    const refreshToken_ = createRefreshToken(user[0].id);

    // update refresh token in user table
    await addRefresh(user[0].id, refreshToken_);

    // send new tokens response
    sendRefreshToken(response, refreshToken_);

    // this return is the same as the sendAccessToken function
    // only the message is different
    return response.status(200).json({
      message: "Refreshed tokens successfully @ auth/refresh_token",
      type: "200 OK",
      accessToken,
    });
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error refreshing tokens @ auth/refresh_token",
      error,
    });
  }
};

const getUserAssets = async (request, response) => {
  try {
    // if user in request, send data
    if (request.user) {
      const maps = await getAllMaps(request.user[0].id);
      const chars = await getAllChars(request.user[0].id);
      const games = await getAllGames(request.user[0]);

      return response.json({
        message: `You are logged in as ${request.user[0].email} @ auth/protected`,
        type: "200 OK",
        user: request.user,
        maps: maps,
        chars: chars,
        games: games,
      });
    }

    // if user not in request, return error
    return response.status(401).json({
      message: "You are not logged in @ auth/protected",
      type: "401 Unauthorized",
    });
  } catch (error) {
    response.status(500).json({
      type: "500 Internal Server Error",
      message: "Error getting protected route @ auth/protected",
      error,
    });
  }
};

module.exports = {
  createAccount,
  resendValidationEmail,
  validateEmail,
  login,
  logout,
  refreshTokens,
  getUserAssets,
};
