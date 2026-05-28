const Joi = require("joi");
// function inside function is closure function
const bodyValidator = (schema) => {
  return async (req, res, next) => {
    try {
      const data = req.body;

      if (!data) {
        next({
          code: 422,
          message: "Data Required",
          status: "EMPTY_PAYLOAD_ERR",
        });
      }
      await schema.validateAsync(data, { abortEarly: false });
      next();
    } catch (exception) {
      next(exception);
    }
  };
};

module.exports = bodyValidator;
