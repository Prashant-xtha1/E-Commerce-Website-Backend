const Joi = require("joi");

// Creating LoginDTO 
const LoginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(25).required()
});

module.exports = {
  LoginDTO
}