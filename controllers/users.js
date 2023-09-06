const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(((data) => res.send(data)))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь с таким id не найден'));
      }
    }))
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      })
        .then(((user) => {
          const userWithoutPassword = user.toObject();
          delete userWithoutPassword.password;
          res.send({ data: userWithoutPassword });
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Данный email уже используется'));
          }
          if (err instanceof validationError) {
            next(new BadRequestError('Ошибка при валидации'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(((user) => res.send({ data: user })))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequestError('Ошибка при валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(((user) => res.send({ data: user })))
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequestError('Ошибка при валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неправильный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Неправильный email или пароль');
    }

    const token = jwt.sign(
      { _id: user._id },
      'big-daddy-caddy',
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });

    res.send({ jwt: token });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then(((data) => res.send(data)))
    .catch(next);
};
