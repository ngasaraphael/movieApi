const jwt = require('jsonwebtoken');

//middleware created and can be added to routes to confirm presence if token(found in header) before given access. ie only loggedin users can access this route
module.exports = function (req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access denied');
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};
