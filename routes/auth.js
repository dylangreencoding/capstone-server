const express = require('express');
const router = express.Router();

// for hashing and comparing passwords
const { hash, compare } = require('bcryptjs');

// for getting new access token using refresh token
const { verify } = require('jsonwebtoken');

// middleware for protected route
const { protected } = require('../utils/protected');

// harperDB
// TODO: rename these better
const searchUsers = require('../harperDB/search-users');
const addUser = require('../harperDB/create-user');
const findUser = require('../harperDB/find-user');
const addRefresh = require('../harperDB/update-r-token');
const updateValidationCode = require('../harperDB/update-validation-code')

const getAllMaps = require('../harperDB/get-all-maps');
const getAllChars = require('../harperDB/get-all-chars');
const getAllGames = require('../harperDB/get-all-games');

// tokens
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  createValidationToken,
} = require('../utils/tokens');

// nodemailer
const {
  transporter,
  validateEmailTemplate,
} = require('../utils/email')

// basic route
// for demonstration and clarity
router.get('/', async (request, response) => {
  response.send(`/auth endpoint`);
});

// handle signup request
router.post('/create-account', async (request, response) => {
  console.log('trying to create account')
  try {
    // destructure client request
    const { name, birthYear, email, password } = request.body;

    // check if user exists
    let user = await searchUsers(email);
    console.log(user)
    // if user exists, return error
    if (user.length !== 0) {
      return response.status(500).json({
        message: `capstone-server-auth/create-account: "User account already exists, try logging in"`,
        type: 'warning',
      });
    }

    // if user doesn't exist, create new user
    // hash (encrypt) the pw
    const passwordHash = await hash(password, 10);
    
    // save user to db
    await addUser(name, birthYear, email, passwordHash);
    user = await searchUsers(email);

    // add validation code to user in db
    const validationCode = createValidationToken(user[0].id);
    await updateValidationCode(user[0].id, validationCode);

    //send validation code to user email
    const mailOptions = validateEmailTemplate(user[0], validationCode);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({
          message: `Error sending email to ${user[0].email}`,
          type: "error",
        });
      }
      return res.json({
        message: `Validation code has been sent to email ${user[0].email}`,
        type: "success",
      });
    });

    // send response
    return response.status(200).json({
      message: 'capstone-server-auth/create-account: "User account created successfully"',
      type: 'success',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/create-account: "Error creating user account"',
      error,
      data: request.body
    });
  }
});










// handle email validation request
router.post('/validate-email', async (request, response) => {
  console.log('trying to validate email')
  try {
    const { validationCode } = request.body;

    // if no validation token, return error
    if (!validationCode) {
      return response.status(500).json({
        message: 'capstone-server-auth/validate-email: "No validation code"',
        type: 'error',
      });
    }

    // if validation token, verify
    let id;
    try {
      id = verify(validationCode, process.env.VALIDATION_TOKEN_SECRET).id;
      console.log(id);
      // HERE
    } catch (error) {
      return response.status(500).json({
        message: 'capstone-server-auth/validate-email: "Invalid email validation token"',
        type: 'error',
      });
    }

    // if validation token invalid, return error
    if (!id) {
      return response.status(500).json({
        message: 'capstone-server-auth/validate-email: "Invalid email validation token"',
        type: 'error',
      });
    }

    // if validation token valid, find user
    let user = await findUser(id);

    // if user doesn't exist, return error
    if (user.length === 0) {
      return response.status(500).json({
        message: 'capstone-server-auth/validate-email: "User does not exist"',
        type: 'error',
      });
    }

    // validate
    await updateValidationCode(user[0].id, '');
    // send response
    return response.status(200).json({
      message: 'capstone-server-auth/validate-email: "Email validated successfully"',
      type: 'success',
    });


  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/validate-email: "Error validating email"',
      error,
    });
  }
});












// handle signin request
router.post('/login', async (request, response) => {
  console.log('trying to log in')
  try {
    const { email, password } = request.body;

    // find user
    const user = await searchUsers(email);

    // if user doesn't exist, return error
    if (user.length === 0) {
      return response.status(500).json({
        message: 'capstone-server-auth/login: "User does not exist"',
        type: 'error',
      });
    }

    // if account has not been validated, return error
    if (user[0].validationCode !== '') {
      return response.status(500).json({
        message: 'capstone-server-auth/login: "User email has not been validated"',
        type: 'error',
      });
    }

    // if user exists, check if password is correct
    const passwordMatch = await compare(password, user[0].password);

    // if password incorrect, return error
    if (!passwordMatch) {
      return response.status(500).json({
        message: 'capstone-server-auth/login: "Password is incorrect"',
        type: 'error',
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
      type: 'error',
      message: 'capstone-server-auth/login: "Error logging in"',
      error,
    });
  }
});








router.post('/logout', (request, response) => {
  // clear cookie...
  response.clearCookie('refresh_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none', 
  });
  
  return response.json({
    message: 'capstone-server-auth/logout: "Logged out successfully"',
    type: 'success',
  });
});









// get new access token using refresh token
router.post('/refresh_token', async (request, response) => {
  try {
    const { refresh_token } = request.cookies;
    console.log('refresh_token', refresh_token);
    // if no refresh token, return error
    if (!refresh_token) {
      return response.status(500).json({
        message: 'capstone-server-auth/refresh_token: "No refresh token"',
        type: 'error',
      });
    }

    // if refresh token, verify
    let id;
    try {
      id = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET).id;
      console.log(id);
      // HERE
    } catch (error) {
      return response.status(500).json({
        message: 'capstone-server-auth/refresh_token: "Invalid refresh token"',
        type: 'error',
      });
    }

    // if refresh token invalid, return error
    if (!id) {
      return response.status(500).json({
        message: 'capstone-server-auth/refresh_token: "Invalid refresh token"',
        type: 'error',
      });
    }

    // if refresh token valid, find user
    const user = await findUser(id);
    console.log('REFRESH USER', user)

    // if user does not exist, return error
    if (user.length === 0) {
      console.log('------user not found')
      return response.status(500).json({
        message: 'capstone-server-auth/refresh_token: "User not found"',
        type: 'error',
      });
    }

    // if user exists, check if refresh token is correct
    // if incorrect, return error
    if (user[0].refresh_token !== refresh_token) {
      console.log('-------invalid refresh token', user)
      return response.status(500).json({
        message: 'capstone-server-auth/refresh_token: "Invalid refresh token"',
        type: 'error',
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
    return response.json({
      message: 'capstone-server-auth/refresh_token: "Refreshed successfully"',
      type: 'success',
      accessToken,
    });

  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/refresh_token: "Error refreshing token"',
      error,
    });
  }
});









// main protected route
// returns user data
router.get('/protected', protected, async (request, response) => {
  
  try {
    // if user in request, send data
    if (request.user) {

      const maps = await getAllMaps(request.user[0].id);
      const chars = await getAllChars(request.user[0].id);
      const games = await getAllGames(request.user[0]);

      return response.json({
        message: 'capstone-server-auth/protected: "You are logged in"',
        type: 'success',
        user: request.user,
        maps: maps,
        chars: chars,
        games: games,
      });
    }

    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/protected: "You are not logged in"',
      type: 'error',
    });


  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/protected: "Error getting protected route"',
      error,
    });
  }
});



module.exports = router;