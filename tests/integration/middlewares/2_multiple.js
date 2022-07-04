module.exports.thirdMiddleware = (req, res, next) => {
  if (req.originalUrl == "/route/sorting") req.mws.push("third");
  next();
};

module.exports.forthMiddleware = (req, res, next) => {
  if (req.originalUrl == "/route/sorting") req.mws.push("forth");
  next();
};
