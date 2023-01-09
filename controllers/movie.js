const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ data: movies.filter((movie) => movie.owner._id.toString() === req.user._id) });
    })
    .catch(() => next(new ServerError('Произошла ошибка')));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const movieObject = {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  };
  Movie.create(movieObject)
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findOne({ movieId })
    .then((movieData) => {
      if (movieData) {
        if (movieData.owner._id.toString() === req.user._id) {
          Movie.deleteOne({ movieId })
            .then(() => { res.send({ data: movieData }); })
            .catch((err) => {
              if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
                next(new BadRequestError('Переданы некорректные данные'));
              } else {
                next(new ServerError('Произошла ошибка'));
              }
            });
        } else next(new ForbiddenError('Фильм принадлежит другому пользователю'));
      } else next(new NotFoundError('Фильм с таким id не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};
