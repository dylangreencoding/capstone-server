const { verify } = require('jsonwebtoken');
const cors = require('cors');
//
const findById = require('../harperDB/find-user');

// middleware function to be called before request is processed
const protected = async (request, response, next) => {
  // cors()
  // get token from request header
  const authorization = request.headers['authorization'];

  // if no token, return error
  if (!authorization) {
    return response.status(500).json({
      message: 'capstone-server-protected-middleware: "No token"',
      type: 'error',
    });
  }

  // if token, verify it
  const token = authorization.split(' ')[1];
  let id;
  try {
    id = verify(token, process.env.ACCESS_TOKEN_SECRET).id;
  } catch {
    return response.status(500).json({
      message: 'capstone-server-protected-middleware: "Invalid token"',
      type: 'error',
    });
  }

  // if token invalid, return error
  if (!id) {
    return response.status(500).json({
      message: 'capstone-server-protected-middleware: "Invalid token"',
      type: 'error',
    });
  }

  // if token valid, find user
  const user = await findById(id);

  // if user does not exist, return error
  if (user.length === 0) {
    return response.status(500).json({
      message: 'capstone-server-protected-middleware: "User not found"',
      type: 'error',
    });
  }

  // if user exists, add new field "user" to request
  request.user = user;

  // call next middleware
  next();
}

module.exports = { protected };