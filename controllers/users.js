const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные или ID пользователя'));
      } else {
        next(new Error('Произошла ошибка'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({ email, password: hashedPassword })
        .then((user) => res.status(201).send({ data: user }))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные'));
          } else {
            next(new Error('Произошла ошибка'));
          }
        });
    })
    .catch(() => {
      next(new Error('Произошла ошибка'));
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.status(200).send({ data: updatedUser });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.status(200).send({ data: updatedUser });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Неправильные почта или пароль'));
            return;
          }

          const token = jwt.sign({ _id: user._id }, 'big-daddy-caddy', { expiresIn: '7d' });

          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          }).send({ message: 'Авторизация успешна' });
        })
        .catch(() => {
          next(new Error('Произошла ошибка'));
        });
    })
    .catch(() => {
      next(new Error('Произошла ошибка'));
    });
};

module.exports.getUserMe = (req, res) => {
  res.status(200).send({ data: req.user });
};
