const Joi = require("joi");
const { UserRoles } = require("../../config/constants");

// Creating LoginDTO 
const LoginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(25).required()
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W@-_]).{8,}$/

const RegisterDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(passwordRegex).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().regex(/^(customer|seller)$/).default(UserRoles.CUSTOMER),
  image: Joi.string().allow(null, '').optional().default(null)
})

module.exports = {
  LoginDTO,
  RegisterDTO
}