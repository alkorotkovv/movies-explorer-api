const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const userRouter = require('./user');
const cardRouter = require('./card');
const auth = require('../middlewares/auth');

const {
  login,
  createUser,
} = require('../controllers/user');

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
const emailRegex = /^([a-zA-Z0-9_.-]+)@([a-z0-9_.-]+)\.([a-z.]{2,6})$/;

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/', userRouter);
router.use('/', cardRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Такого роута не существует'));
});

module.exports = router;
