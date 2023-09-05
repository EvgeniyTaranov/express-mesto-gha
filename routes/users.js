const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

const {
  validateUserId,
  validateProfileUpdate,
  validateAvatarUpdate,
} = require('../middlewares/validation');

userRouter.use(auth);
userRouter.get('/', getUsers);
userRouter.get('/:id', validateUserId, getUserById);
userRouter.patch('/me', validateProfileUpdate, updateProfile);
userRouter.patch('/me/avatar', validateAvatarUpdate, updateAvatar);

module.exports = userRouter;
