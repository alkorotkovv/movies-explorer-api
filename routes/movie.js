const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  deleteMovieById,
  createMovie,
} = require('../controllers/card');

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

router.get('/movies', getMovies);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(urlRegex),
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovieById);

module.exports = router;
