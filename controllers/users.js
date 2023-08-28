const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные или ID пользователя' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const handleValidationError = (res) => {
  res.status(400).send({ message: 'Переданы некорректные данные' });
};

const handleUserNotFound = (res) => {
  res.status(404).send({ message: 'Пользователь не найден' });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        handleValidationError(res);
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
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
