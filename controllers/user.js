const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMe = (req, res, next) => {
  const id = req.user._id;
  console.log(id);
  User.findById(id)
    .then((user) => {
      if (user) res.send({ data: user });
      else next(new NotFoundError('Пользователь с таким id не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((userDocument) => {
      const user = userDocument.toObject();
      delete user.password;
      res.send({ data: user });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.updateMe = (req, res, next) => {
  const { name, email } = req.body;
  User.find({ email })
    .then((userData) => {
      if ((userData.length) && (userData[0]._id.toString() !== req.user._id)) next(new ConflictError('Пользователь с таким email уже существует'));
      else {
        User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
          .then((user) => {
            if (user) res.send({ data: user });
            else next(new NotFoundError('Пользователь с таким id не найден'));
          })
          .catch((err) => {
            if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
              next(new BadRequestError('Переданы некорректные данные'));
            } else {
              next(new ServerError('Произошла ошибка'));
            }
          });
      }
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};
