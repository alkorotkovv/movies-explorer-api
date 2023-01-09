const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  getUsers,
  getUserById,
  updateMeInfo,
  updateMeAvatar,
} = require('../controllers/user');

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

router.get('/users/me', getMe);
router.get('/users', getUsers);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateMeInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex),
  }),
}), updateMeAvatar);

module.exports = router;
