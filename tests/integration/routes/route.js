const express = require("express");
const router = express.Router();

router.get("/:testing", (req, res) => {
  return req.mws
    ? res.status(200).send(req.mws.join(" "))
    : res.status(200).send("choopoon");
});

module.exports = router;
