const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { Joi } = require('celebrate');
const UnauthorizedError = require('../errors/UnauthorizedError');

//const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

const userSchema = new mongoose.Schema({
  versionKey: false,
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    default: 'Сдающий диплом',
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => { validator.isEmail(email); },
      message: () => 'Неверный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверный логин или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неверный логин или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
