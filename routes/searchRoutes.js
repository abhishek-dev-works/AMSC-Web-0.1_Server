const express = require("express");
const router = express.Router();
const { search } = require("../controllers/SearchController");

router.post("/", search);

module.exports = router;
