const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  updateMe,
} = require('../controllers/user');

router.get('/users/me', getMe);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
}), updateMe);

module.exports = router;
