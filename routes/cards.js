const cardRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  validateCard,
  validateCardId,
} = require('../middlewares/validation');

cardRouter.use(auth);
cardRouter.get('/', getCards);
cardRouter.post('/', validateCard, createCard);
cardRouter.delete('/:cardId', validateCardId, deleteCard);
cardRouter.put('/:cardId/likes', validateCardId, likeCard);
cardRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRouter;
