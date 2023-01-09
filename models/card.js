const mongoose = require('mongoose');
const { Joi } = require('celebrate');

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

const cardSchema = new mongoose.Schema({
  versionKey: false,
  name: { // у карточки есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true,
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => !Joi.string().pattern(urlRegex).required().validate(url).error,
      message: () => 'Неверный формат url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
