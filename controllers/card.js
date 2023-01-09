const Card = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

module.exports.getMovies = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => next(new ServerError('Произошла ошибка')));
};

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const cardObject = {
    name,
    link,
    owner: req.user._id,
  };
  Card.create(cardObject)
    .then((card) => {
      res.send({ data: card });
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
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((cardData) => {
      if (cardData) {
        if (cardData.owner._id.toString() === req.user._id) {
          Card.findByIdAndRemove(cardId)
            .then((card) => { res.send({ data: card }); })
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