const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');

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

    // eslint-disable-next-line no-undef
    User.findById(_id)
      // eslint-disable-next-line consistent-return
      .then((user) => {
        if (!user) {
          return next(new NotFoundError('Пользователь не найден'));
        }

        req.user = user;
        next();
      })
      .catch(() => {
        next();
      });
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
