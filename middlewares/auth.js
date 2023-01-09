const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  console.log(req.headers);
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return next(new UnauthorizedError('Неверный логин или пароль'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Неверный логин или пароль'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
