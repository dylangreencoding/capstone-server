// access environment variables
require('dotenv').config();

// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// import routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const blogRouter = require('./routes/blog')

// server port
const port = process.env.PORT;

// create express app \\
const app = express();

// add middleware \\
// parse request body as JSON
// set request body size limit
// default is 100kb to prevent attacks of some sort ??
app.use(express.json({ limit: '2mb' }));
// parse request body as query string
app.use(express.urlencoded({ extended: false }));
// parse cookies
app.use(cookieParser());
// allow cross-origin requests
app.use(cors());

// add routes \\
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/blog', blogRouter);





// start server \\
// servers job is to run continuously and "listen" for requests (http or similar)
app.listen(port, function () {
  // good practice to log
  console.log(`capstone-server: "Listening on port ${port} !!!"`);
});