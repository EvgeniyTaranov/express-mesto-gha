const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => next(new BadRequestError('Произошла ошибка')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  const cardData = {
    name,
    link,
    owner: req.user._id,
  };

  Card.create(cardData)
    .then((card) => res.status(201).send({ data: card }))
    .catch(() => next(new BadRequestError('Ошибка при создании карточки')));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }

      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }

      card.remove()
        .then(() => res.status(200).send({ data: card }))
        .catch((error) => {
          if (error.name === 'CastError') {
            return next(new BadRequestError('Некорректный формат ID карточки'));
          }
          return next(new BadRequestError('Произошла ошибка'));
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Некорректный формат ID карточки'));
      }
      return next(new BadRequestError('Произошла ошибка'));
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Некорректный формат ID карточки'));
      }
      return next(new BadRequestError('Произошла ошибка'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Некорректный формат ID карточки'));
      }
      return next(new BadRequestError('Произошла ошибка'));
    });
};
