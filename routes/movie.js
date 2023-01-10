const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  deleteMovieById,
  createMovie,
} = require('../controllers/movie');

const urlRegex = /^(https?:\/\/)/;

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    thumbnail: Joi.string().required().pattern(urlRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:Id', celebrate({
  params: Joi.object().keys({
    Id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovieById);

module.exports = router;
