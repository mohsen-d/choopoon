module.exports = function (req, res, next) {
  if (req.originalUrl == "/route/testingmiddlewares")
    return res.status(403).send("blocked by middleware");
  else next();
};
