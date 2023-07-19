const { validationResult } = require("express-validator");
const ApiError = require("../exeptions/api-error");

module.exports = function (req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(ApiError.BadRequest("Ошибка при валидации", error.array()));
  }
  next();
};
