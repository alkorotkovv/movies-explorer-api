// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://mesto.alkorotkovv.nomoredomains.club',
  'http://api.mesto.alkorotkovv.nomoredomains.club',
  'https://localhost:3000',
  'http://localhost:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// eslint-disable-next-line consistent-return
module.exports = (err, req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const requestHeaders = req.headers['access-control-request-headers'];
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
};
