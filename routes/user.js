const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  updateMeInfo,
} = require('../controllers/user');

//const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

router.get('/users/me', getMe);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
}), updateMeInfo);

module.exports = router;
