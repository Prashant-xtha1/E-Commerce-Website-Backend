const Joi = require("joi");
const { Status } = require("../../config/constants");

const BannerDTO = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  url: Joi.string().uri().optional().default(null),
  image: Joi.string().allow(null, "").optional().default(null),
  status: Joi.string().regex(/^(active|inactive)$/).default(Status.INACTIVE)
})

module.exports = {
  BannerDTO
}