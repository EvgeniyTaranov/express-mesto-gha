// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const handleValidationError = (res) => {
  res.status(400).send({ message: 'Переданы некорректные данные' });
};

const handleUserNotFound = (res) => {
  res.status(404).send({ message: 'Пользователь не найден' });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        handleUserNotFound(res);
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные или ID пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name = 'Жак-Ив Кусто', about = 'Исследователь', avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png', email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name, about, avatar, email, password: hashedPassword,
      })
        .then((user) => res.status(201).send({ data: user }))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            handleValidationError(res);
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
          }
        });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        handleUserNotFound(res);
      } else {
        res.status(200).send({ data: updatedUser });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        handleValidationError(res);
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        handleUserNotFound(res);
      } else {
        res.status(200).send({ data: updatedUser });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        handleValidationError(res);
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'Неправильные почта или пароль' });
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(401).send({ message: 'Неправильные почта или пароль' });
            return;
          }

          const token = jwt.sign({ _id: user._id }, 'big-daddy-caddy', { expiresIn: '7d' });

          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          }).send({ message: 'Авторизация успешна' });
        })
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserMe = (req, res) => {
  res.status(200).send({ data: req.user });
};
