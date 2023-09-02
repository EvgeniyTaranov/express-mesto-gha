const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (err, req, res) => {
  if (err instanceof UnauthorizedError) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err instanceof BadRequestError || err.name === 'ValidationError') {
    res.status(400).send({ message: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'Некорректный формат ID' });
  } else if (err.name === 'MongoError' && err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким email уже существует' });
  } else if (err.name === 'JsonWebTokenError') {
    res.status(401).send({ message: 'Некорректный токен' });
  } else {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};
