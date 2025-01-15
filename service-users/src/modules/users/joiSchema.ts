import * as Joi from 'joi';

const rol = Joi.string().valid('admin', 'member', 'viewer');

export const userRegisterSchema = Joi.object({
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  rol: rol.required(),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().optional().allow(''),
  rol: rol.optional(),
});
