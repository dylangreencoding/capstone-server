// access environment variables
require('dotenv').config();

// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');

// import routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

// server port
const port = process.env.PORT;

// create express app
const app = express();

// add middleware to 
// parse request body as JSON
app.use(express.json());
// parse request body as query string
app.use(express.urlencoded({ extended: false }));
// parse cookies
app.use(cookieParser());

// add routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

// start server
// servers job is to run continuously and "listen" for requests (http or similar)
app.listen(port, function () {
  // good practice to log
  console.log(`!!! Listening on port ${port} !!!`);
});