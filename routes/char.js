const express = require("express");
const router = express.Router();

const { saveChar, deleteExistingChar } = require("../end-ware/for-char");

// creates/updates characters
router.post("/save", saveChar);

// deletes characters
router.post("/delete", deleteExistingChar);

module.exports = router;
