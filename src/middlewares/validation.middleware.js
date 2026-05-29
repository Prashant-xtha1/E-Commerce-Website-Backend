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
      let messageBag = {};
      if(exception instanceof Joi.ValidationError) {
        exception.details.map((error) => {
          messageBag[error.path.pop()] = error.message;
        })
      }

      next({
        code: 400,
        details: messageBag,
        message: "Validation Failed",
        status: "VALIDATION_ERR",
      });
    }
  };
};

module.exports = bodyValidator;
