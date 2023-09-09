const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'big-daddy-caddy');
  } catch (err) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }
  req.user = payload;
  next();
};
