import * as Joi from 'joi';
// Schema for login
export const loginUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  rol: Joi.string().valid('member', 'admin', 'viewer').optional(),
});
