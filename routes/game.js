const express = require("express");
const router = express.Router();

const {
  saveGame,
  deleteExistingGame,
  joinExistingGame,
  removePlayer,
} = require("../end-ware/for-game");

// creates/updates games
router.post("/save", saveGame);
router.post("/delete", deleteExistingGame);
router.post("/join", joinExistingGame);
router.post("/remove-player", removePlayer);

module.exports = router;
