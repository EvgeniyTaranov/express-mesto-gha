const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

const {
  validationUserId,
  validationUserInfo,
  validationUserAvatar,
} = require('../middlewares/validation');

userRouter.get('/', getUsers);
userRouter.get('/:id', validationUserId, getUserById);
userRouter.patch('/me', validationUserInfo, updateProfile);
userRouter.patch('/me/avatar', validationUserAvatar, updateAvatar);

module.exports = userRouter;
