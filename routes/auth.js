const express = require('express');
const router = express.Router();
// for encrypting and comparing passwords
const { hash, compare } = require('bcryptjs');
// for getting new access token using refresh token
const { verify } = require('jsonwebtoken');
//
// middleware for protected route
const { protected } = require('../utils/protected');
//
// harperDB
// TODO: rename these better
const searchUsers = require('../harperDB/search-users');
const addUser = require('../harperDB/create-user');
const findUser = require('../harperDB/find-user');
const addRefresh = require('../harperDB/update-r-token');

const getAllMaps = require('../harperDB/get-all-maps');
const createMap = require('../harperDB/create-map');
const updateMap = require('../harperDB/update-map');
const deleteMap = require('../harperDB/delete-map');

const getAllChars = require('../harperDB/get-all-chars');
const createChar = require('../harperDB/create-char');
const updateChar = require('../harperDB/update-char');
const deleteChar = require('../harperDB/delete-char');

const getAllGames = require('../harperDB/get-all-games');
const createGame = require('../harperDB/create-game');
const updateGame = require('../harperDB/update-game');
const deleteGame = require('../harperDB/delete-game');
const addGameToUser = require('../harperDB/add-game-to-user');
const removeGameFromUser = require('../harperDB/remove-game-from-user');
const removeUserFromGame = require('../harperDB/remove-user-from-game');
const findGame = require('../harperDB/find-game');
const joinGame = require('../harperDB/join-game');

//
// tokens
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require('../utils/tokens');
const findById = require('../harperDB/find-user');

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
    const { email, password } = request.body;

    // check if user exists
    const user = await searchUsers(email);
    console.log(user);

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
    await addUser(email, passwordHash);

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

// handle signin request
router.post('/login', async (request, response) => {
  console.log('trying to log in')
  try {
    const { email, password } = request.body;

    // find user
    const user = await searchUsers(email);
    console.log(user);

    // if user doesn't exist, return error
    if (user.length === 0) {
      return response.status(500).json({
        message: 'capstone-server-auth/login: "User does not exist"',
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
    // response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    // response.setHeader('Access-Control-Allow-Methods', 'POST')
    sendRefreshToken(response, refreshToken);
    sendAccessToken(request, response, accessToken);
    console.log(response)
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
  
  console.log('logout', response)
  return response.json({
    message: 'capstone-server-auth/logout: "Logged out successfully"',
    type: 'success',
  });
});

// get new access token using refresh token
router.post('/refresh_token', async (request, response) => {
  try {
    const { refresh_token } = request.cookies;
    console.log(request);
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
    console.log(user);

    // if user does not exist, return error
    if (user.length === 0) {
      return response.status(500).json({
        message: 'capstone-server-auth/refresh_token: "User not found"',
        type: 'error',
      });
    }

    // if user exists, check if refresh token is correct
    // if incorrect, return error
    if (user[0].refresh_token !== refresh_token) {
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


// creates/updates maps
router.post('/save-map', protected, async (request, response) => {
  try {
    if (request.user) {

      if (request.body.id === '') {
        await createMap(request.body);

      } else {
        await updateMap(request.body);
      }

      return response.json({
        message: 'capstone-server-auth/save-map: "Map saved successfully"',
        type: 'success',
        map: request.body
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/save-map: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/save-map: "Error getting protected route"',
      error,
    });
  }
})

// deletes map
router.post('/delete-map', protected, async (request, response) => {
  try {
    if (request.user) {

      await deleteMap(request.body);

      return response.json({
        message: 'capstone-server-auth/delete-map: "Map deleted successfully"',
        type: 'success',
        map: request.body,
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/delete-map: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/delete-map: "Error getting protected route"',
      error,
    });
  }
})

// creates/updates characters
router.post('/save-char', protected, async (request, response) => {
  try {
    if (request.user) {
      console.log('COOOKIE', request.cookies)

      if (request.body.id === '') {
        await createChar(request.body);

      } else {
        await updateChar(request.body);
      }

      return response.json({
        message: 'capstone-server-auth/save-char: "Character saved successfully"',
        type: 'success',
        char: request.body
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/save-char: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/save-char: "Error getting protected route"',
      error,
    });
  }
})

// deletes characters
router.post('/delete-char', protected, async (request, response) => {
  try {
    if (request.user) {

      await deleteChar(request.body);

      return response.json({
        message: 'capstone-server-auth/delete-char: "Character deleted successfully"',
        type: 'success',
        char: request.body,
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/delete-char: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/delete-char: "Error getting protected route"',
      error,
    });
  }
})

// creates/updates games
router.post('/save-game', protected, async (request, response) => {
  try {
    if (request.user) {
      let gameId
      let game;
      if (request.body.id === '') {
        gameId = await createGame(request.body);
        await addGameToUser(request.user[0], gameId.inserted_hashes[0]);
        game = await findGame(gameId.inserted_hashes[0]);

      } else {
        gameId = await updateGame(request.body);
        game = await findGame(gameId.update_hashes[0]);
      }
      return response.json({
        message: 'capstone-server-auth/save-game: "Game saved successfully"',
        type: 'success',
        game: game[0],
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/save-game: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/save-game: "Error getting protected route"',
      error,
    });
  }
})

// deletes game
router.post('/delete-game', protected, async (request, response) => {
  try {
    console.log('/delete-game')
    if (request.user) { 
      console.log('user authorized')
      const game = request.body;
      const userId = request.user[0].id;
      console.log('game', game)
      console.log('userId', userId)
      if (game.players[userId] === 'host' && Object.keys(game.players).length === 1) {
        console.log('host delete game')
        await removeUserFromGame(request.user[0], request.body);
        await removeGameFromUser(request.user[0], request.body);
        await deleteGame(request.body);
      } else if (game.players[userId] === 'host' && Object.keys(game.players).length > 1) {
        console.log('host trying to delete game, still users in game')
      } else if (game.players[userId] === 'guest') {
        console.log('guest leave game')
        await removeUserFromGame(request.user[0], request.body);
        await removeGameFromUser(request.user[0], request.body);
      } else {
        console.log('guest leave game again')
        await removeGameFromUser(request.user[0], request.body);
      }

      return response.json({
        message: 'capstone-server-auth/delete-game: "Game deleted successfully"',
        type: 'success',
        game: request.body,
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/delete-game: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/delete-game: "Error getting protected route"',
      error,
    });
  }
})

// join game
router.post('/join-game', protected, async (request, response) => {
  try {

    if (request.user) {

      let game = await findGame(request.body.id);
      const user = request.user[0];

      if (game.length === 1 && !user.games.includes(request.body.id)) {
        await addGameToUser(request.user[0], request.body.id);
        // add player to game as guest
        game[0].players[user.id] = 'guest';
        // HERE: add player character to game.selectFrom
        game[0].selectFrom[user.id] = request.body.character;
        // console.log(game[0].selectFrom);
        await joinGame(game[0]);
        game = await findGame(request.body.id);
        console.log('GAME', game)

        return response.json({
          message: 'capstone-server-auth/join-game: "Game joined successfully"',
          type: 'success',
          game: game,
        })
      } else {
        // if game not found, return error
        return response.status(500).json({
          message: 'capstone-server-auth/join-game: "No game by that id"',
          type: 'error',
    });
      }
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/join-game: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/join-game: "Error getting protected route"',
      error,
    });
  }
})

// remove-player from game
router.post('/remove-player', protected, async (request, response) => {
  try {
    console.log('/remove-player')
    if (request.user) { 
      console.log('user authorized')
      const { game, playerId } = request.body;
      const user = await findById(playerId)

      await removeGameFromUser(user[0], game);
      const gameUpdate = await removeUserFromGame(user[0], game);
      const updatedGame = await findGame(gameUpdate.update_hashes[0]);

      return response.json({
        message: 'capstone-server-auth/remove-player: "Player removed successfully"',
        type: 'success',
        game: updatedGame[0],
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server-auth/remove-player: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server-auth/remove-player: "Error getting protected route"',
      error,
    });
  }
})

module.exports = router;