const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const decodedToken = jwt.verify(token, 'big-daddy-caddy');
    const { _id } = decodedToken;
    req.user = { _id };
    next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
