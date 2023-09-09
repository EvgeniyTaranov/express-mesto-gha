const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const Card = require('../models/card');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  const cardData = {
    name,
    link,
    owner: req.user._id,
  };

  Card.create(cardData)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequestError('Ошибка при валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new NotFoundError(`Карточка с id '${cardId}' не найдена`))
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалять чужие карточки'));
      }
      return Card.findByIdAndRemove(cardId)
        // eslint-disable-next-line consistent-return
        .then((data) => {
          if (data) {
            return res.send({ message: 'Карточка удалена' });
          }
        })
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequestError('Передан некорректный id карточки'));
      } else { next(err); }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError('Карточка с таким id не найдена'));
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequestError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError('Карточка с таким id не найдена'));
      }
    })
    .catch((err) => {
      if (err instanceof castError) {
        next(new BadRequestError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};
