const express = require('express');
const router = express.Router();
const { hash, compare } = require('bcryptjs');
//
// harperDB
const searchUsers = require('../harperDB/search-users');
const addUser = require('../harperDB/add-user')
const addRefresh = require('../harperDB/update-r-token')
//
// tokens
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require('../utils/tokens');

// for demonstration and clarity
router.get('/', async (request, response) => {
  response.send(`/auth endpoint`);
});

// handle signup request
router.post('/signup', async (request, response) => {
  try {
    // destructure client request
    const { email, password } = request.body;

    // check if user exists
    const user = await searchUsers(email);
    console.log(user);

    // if user exists, return error
    if (user.length !== 0) {
      return response.status(500).json({
        message: `User already exists. Try logging in.`,
        type: 'warning',
      });
    }

    // if user doesn't exist, create new user
    // hash (encrypt) the pw
    const passwordHash = await hash(password, 10);
    // save user to db
    await addUser(email, passwordHash);

    // send response
    return response.status(200).json({
      message: '!!! User created successfully',
      type: 'success',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: '!!! Error creating user',
      error,
    });
  }
});

// handle signin request
router.post('/signin', async (request, response) => {
  console.log('trying to sign in')
  try {
    const { email, password } = request.body;

    // find user
    const user = await searchUsers(email);
    console.log(user);

    // if user doesn't exist, return error
    if (user.length === 0) {
      return response.status(500).json({
        message: 'User does not exist.',
        type: 'error',
      });
    }

    // if user exists, check if password is correct
    const passwordMatch = await compare(password, user[0].password);

    // if password incorrect, return error
    if (!passwordMatch) {
      return response.status(500).json({
        message: '!!! Password is incorrect !!!',
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
      message: '!!! Error signing in !!!',
      error,
    });
  }
});

module.exports = router;