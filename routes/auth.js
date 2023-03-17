const express = require('express');
const router = express.Router();
const { hash } = require('bcryptjs');

const searchUsers = require('../harperDB/search-users');
const addUser = require('../harperDB/add-user')

router.get('/', function (request, response) {
  response.send(`/auth endpoint`);
});

router.post('/signup', async (request, response) => {
  try {
    // destructure client request
    const { email, password } = request.body;

    // check if user exists
    const user = await searchUsers(email);

    // if user exists, return error
    if (user === email) {
      return response.status(500).json({
        message: `User: ${user[0].email} already exists. Try logging in.`,
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

module.exports = router;