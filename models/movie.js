const mongoose = require('mongoose');
const { Joi } = require('celebrate');

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

const movieSchema = new mongoose.Schema({
  versionKey: false,
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => !Joi.string().pattern(urlRegex).required().validate(url).error,
      message: () => 'Неверный формат url',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (url) => !Joi.string().pattern(urlRegex).required().validate(url).error,
      message: () => 'Неверный формат url',
    },
  },
  thumbnail: {
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
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
