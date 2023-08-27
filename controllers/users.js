const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// eslint-disable-next-line consistent-return
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  // eslint-disable-next-line no-undef
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Некорректный формат идентификатора пользователя' });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name) {
    return res.status(400).send({ message: 'Поле name обязательно для заполнения' });
  }

  if (!about) {
    return res.status(400).send({ message: 'Поле about обязательно для заполнения' });
  }

  if (!avatar) {
    return res.status(400).send({ message: 'Поле avatar обязательно для заполнения' });
  }

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(400).send({ message: 'Ошибка при создании пользователя', error: err.message }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    // eslint-disable-next-line consistent-return
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send({ data: updatedUser });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    // eslint-disable-next-line consistent-return
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send({ data: updatedUser });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные' }));
};
