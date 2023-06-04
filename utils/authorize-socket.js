const { verify } = require("jsonwebtoken");
//
const { findById } = require("../harperDB/users-table");

// middleware for socket authorization
const authorizeSocket = async (authHeader) => {
  // get token from request auth header
  const token = authHeader.split(" ")[1];

  // verify token
  let id;
  try {
    id = verify(token, process.env.ACCESS_TOKEN_SECRET).id;
  } catch {
    return false;
  }

  // if token invalid, return error
  if (!id) {
    return false;
  }

  // if token valid, find user
  const user = await findById(id);

  // if user does not exist, return error
  if (user.length === 0) {
    return false;
  }

  // TODO: add column isLoggedIn: true||false to user table
  // set on login/logout
  // use isLoggedIn to test whether socket connection is valid
  // instead of the way it is now ->
  // ->
  // if user exists, return true
  return true;
};

module.exports = { authorizeSocket };
