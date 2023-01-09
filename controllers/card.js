const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => next(new ServerError('Произошла ошибка')));
};

module.exports.createCard = (req, res, next) => {
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

module.exports.deleteCardById = (req, res, next) => {
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

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) res.send({ data: card });
      else next(new NotFoundError('Карточка с таким id не найдена'));
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) res.send({ data: card });
      else next(new NotFoundError('Карточка с таким id не найдена'));
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};
