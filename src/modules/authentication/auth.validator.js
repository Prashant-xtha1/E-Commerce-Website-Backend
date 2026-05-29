const Joi = require("joi");

// Creating LoginDTO 
const LoginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(25).required()
});

const RegisterDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().valid("user", "seller").default("user"),
  image: Joi.string().allow(null, '').optional().default(null)
})

module.exports = {
  LoginDTO,
  RegisterDTO
}