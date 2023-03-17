const express = require('express');

// create router using express
const router = express.Router();

// configure routes
// GET home page
router.get('/', function (request, response) {
  console.log('request', request);
  console.log('response', response);
  // send string as response
  // use [response.json()] to send JSON object
  response.send(`/ endpoint, i.e. home page`);
});

// exports module
module.exports = router;