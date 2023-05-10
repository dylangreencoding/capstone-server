const express = require('express');
const router = express.Router();
// console.log(router);

// middleware for protected route
const { protected } = require('../utils/protected');

// const getAllGames = require('../harperDB/get-all-games');
const createGame = require('../harperDB/create-game');
const updateGame = require('../harperDB/update-game');
const deleteGame = require('../harperDB/delete-game');
const addGameToUser = require('../harperDB/add-game-to-user');
const removeGameFromUser = require('../harperDB/remove-game-from-user');
const removeUserFromGame = require('../harperDB/remove-user-from-game');
const findGame = require('../harperDB/find-game');
const joinGame = require('../harperDB/join-game');

const findById = require('../harperDB/find-user');

// creates/updates games
router.post('/save', protected, async (request, response) => {
  try {
    if (request.user) {
      let gameId;
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
        message: 'capstone-server/game/save: "Game saved successfully"',
        type: 'success',
        game: game[0],
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server/game/save: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server/game/save: "Error getting protected route"',
      error,
    });
  }
})

// deletes game
router.post('/delete', protected, async (request, response) => {
  try {

    if (request.user) { 
      const game = request.body;
      const userId = request.user[0].id;

      if (game.players[userId] === 'host' && Object.keys(game.players).length === 1) {
        // console.log('host delete game')
        await removeUserFromGame(request.user[0], request.body);
        await removeGameFromUser(request.user[0], request.body);
        await deleteGame(request.body);
      } else if (game.players[userId] === 'host' && Object.keys(game.players).length > 1) {
        // console.log('host trying to delete game, still users in game')
      } else if (game.players[userId] === 'guest') {

        await removeUserFromGame(request.user[0], request.body);
        await removeGameFromUser(request.user[0], request.body);
      } else {
        // console.log('guest leave game again')
        await removeGameFromUser(request.user[0], request.body);
      }

      const updatedGame = await findGame(game.id);

      return response.json({
        message: 'capstone-server/game/delete: "Game deleted successfully"',
        type: 'success',
        game: updatedGame,
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server/game/delete: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server/game/delete: "Error getting protected route"',
      error,
    });
  }
})

// join game
router.post('/join', protected, async (request, response) => {
  try {

    // if authenticated by /protected route
    if (request.user) {

      // look for game with provided id
      let game = await findGame(request.body.id);
      const user = request.user[0];

      // if game exists and you aren't already in it
      if (game.length === 1 && !user.games.includes(request.body.id)) {
        await addGameToUser(request.user[0], request.body.id);
        // add player to game as guest
        game[0].players[user.id] = 'guest';
        // HERE: add player character to game.selectFrom
        game[0].selectFrom[user.id] = request.body.character;
        // console.log(game[0].selectFrom);
        await joinGame(game[0]);
        game = await findGame(request.body.id);


        return response.json({
          message: 'capstone-server/game/join: "Game joined successfully"',
          type: 'success',
          game: game,
        })
      } else {
        // if game not found, return error
        return response.status(500).json({
          message: 'capstone-server/game/join: "No game by that id"',
          type: 'error',
    });
      }
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server/game/join: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server/game/join: "Error getting protected route"',
      error,
    });
  }
})

// remove-player from game
router.post('/remove-player', protected, async (request, response) => {
  try {
    // console.log('/remove-player')
    if (request.user) { 


      const { game, playerId } = request.body;
      const user = await findById(playerId)
      const playerRemoved = await removeGameFromUser(user[0], game);

      // ensures player is not removed from game until game is removed from player
      let updatedGame;
      if (playerRemoved.update_hashes[0] = playerId) {
        const gameUpdate = await removeUserFromGame(user[0], game);
        updatedGame = await findGame(gameUpdate.update_hashes[0]);
      }

      return response.json({
        message: 'capstone-server/game/remove-player: "Player removed successfully"',
        type: 'success',
        game: updatedGame[0],
      })
    }
    // if user not in request, return error
    return response.status(500).json({
      message: 'capstone-server/game/remove-player: "You are not logged in"',
      type: 'error',
    });
  } catch (error) {
    response.status(500).json({
      type: 'error',
      message: 'capstone-server/game/remove-player: "Error getting protected route"',
      error,
    });
  }
})

module.exports = router;