const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new UnauthorizedError('Требуется авторизация'));
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'big-daddy-caddy');
  } catch (err) {
    next(new UnauthorizedError('Требуется авторизация'));
  }
  req.user = payload;
  next();
};
