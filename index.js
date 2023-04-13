// access environment variables
require('dotenv').config();

// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// for socket server
const http = require('http');
const { Server } = require ('socket.io');

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
app.use(express.json({ limit: '10mb' }));
// parse request body as query string
app.use(express.urlencoded({ extended: false }));
// parse cookies
app.use(cookieParser());
// allow cross-origin requests
app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  exposedHeaders: ['*', 'Authorization' ] 
}));
// add routes \\
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/blog', blogRouter);

// socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST'],
  },
});

// listen for when client connects via socket.io-client
io.on('connection', (socket) => {
  console.log(`SOCKET connection, socketID ${socket.id}`);
  
  // listen for join_gameroom
  socket.on('join_gameroom', (data) => {
    // data sent from client when join_gameroom event emitted
    console.log('SOCKET join_gameroom', data);
    
    const { gameroomId, userEmail } = data;
    socket.join(gameroomId);

    // // emit event and data to users in room NOT including the one that just joined
    // socket.to(gameroomId).emit('', {});

    // // emit event and data to users in room INCLUDING the one that just joined
    io.in(gameroomId).emit('socket_message', { 
      message: `player ${userEmail} joined gameroom ${gameroomId}`,
    });
  });

  // listen for leave_gameroom
  socket.on('leave_gameroom', (data) => {
    // data sent from client when leave_gameroom event emitted
    console.log('SOCKET leave_gameroom', data);

    const { gameroomId, userEmail } = data;
    socket.leave(gameroomId);

    socket.to(gameroomId).emit('socket_message', { 
      message: `player ${userEmail} left ${gameroomId}`,
    });
  });

  socket.on('send_game', (data) => {
    console.log(data);
    const {gameroomId, game} = data;

    socket.to(gameroomId).emit('receive_game', { 
      message: `WTF???`,
      game,
    });
  })

  socket.on('disconnect', () => {
    console.log('SOCKET disconnect')
    // const { gameroomId, userEmail } = data;

    // socket.to(gameroomId).emit('socket_message', { 
    //   message: `player ${userEmail} disconnected from ${gameroomId}`,
    // });
  });

});


// start server \\
// servers job is to run continuously and "listen" for requests (http or similar)
server.listen(port, function () {
  console.log(`capstone-server: "Listening on port ${port} !!!"`);
});