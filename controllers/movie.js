const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(() => next(new ServerError('Произошла ошибка')));
};

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const movieObject = {
    name,
    link,
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
  Movie.findById(movieId)
    .then((movieData) => {
      if (movieData) {
        if (movieData.owner._id.toString() === req.user._id) {
          Movie.findByIdAndRemove(movieId)
            .then((movie) => { res.send({ data: movie }); })
            .catch((err) => {
              if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
                next(new BadRequestError('Переданы некорректные данные'));
              } else {
                next(new ServerError('Произошла ошибка'));
              }
            });
        } else next(new ForbiddenError('Карточка принадлежит другому пользователю'));
      } else next(new NotFoundError('Карточка с таким id не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};
