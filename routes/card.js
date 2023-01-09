const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(urlRegex),
  }),
}), createCard);

router.get('/cards', getCards);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), deleteCardById);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), dislikeCard);

module.exports = router;
