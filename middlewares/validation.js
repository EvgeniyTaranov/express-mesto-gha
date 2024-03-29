const { Joi, celebrate } = require('celebrate');
const { isURL, isEmail } = require('validator');
const { ObjectId } = require('mongoose').Types;
const BadRequestError = require('../errors/badRequestError');

const validateURL = (URL) => {
  if (isURL(URL)) {
    return URL;
  }
  throw new BadRequestError(': invalid URL');
};

const validateEmail = (Email) => {
  if (isEmail(Email)) {
    return Email;
  }
  throw new BadRequestError(': invalid Email');
};

const validateId = (Id) => {
  if (ObjectId.isValid(Id)) {
    return Id;
  }
  throw new BadRequestError(': invalid Id');
};

module.exports.validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
});

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(6),
  }),
});

module.exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom(validateId),
  }),
});

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validateId),
  }),
});
