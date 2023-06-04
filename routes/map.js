const express = require("express");
const router = express.Router();

const { saveMap, deleteExistingMap } = require("../end-ware/for-map");

// creates/updates maps
router.post("/save", saveMap);
// deletes map
router.post("/delete", deleteExistingMap);

module.exports = router;
