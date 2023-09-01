const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  validateUserId,
  validateProfileUpdate,
  validateAvatarUpdate,
} = require('../middlewares/validation');

userRouter.get('/', getUsers);
userRouter.get('/me', auth, getUserMe);
userRouter.get('/:id', validateUserId, getUserById);
userRouter.patch('/me', auth, validateProfileUpdate, updateProfile);
userRouter.patch('/me/avatar', auth, validateAvatarUpdate, updateAvatar);

module.exports = userRouter;
