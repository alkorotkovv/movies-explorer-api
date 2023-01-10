const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  updateMe,
} = require('../controllers/user');

const emailRegex = /^([a-zA-Z0-9_.-]+)@([a-z0-9_.-]+)\.([a-z.]{2,6})$/;

router.get('/users/me', getMe);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().pattern(emailRegex),
  }),
}), updateMe);

module.exports = router;
