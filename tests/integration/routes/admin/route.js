const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.send("subfolders is scanned too");
});

module.exports = router;
