import * as Joi from 'joi';

export const teamCreateSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).messages({
    'string.empty': 'El nombre del equipo no puede estar vacío',
    'string.base': 'El nombre del equipo debe tener entre 2 y 100 caracteres',
  }),
});

export const teamUpdateSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).messages({
    'string.empty': 'El nombre del equipo no puede estar vacío',
    'string.base': 'El nombre del equipo debe tener entre 2 y 100 caracteres',
  }),
});

export const teamMemberSchema = Joi.object({
  userId: Joi.number().required().messages({
    'number.base': 'El id del usuario es obligatorio',
  }),
  role: Joi.string().valid('admin', 'member', 'viewer').required().messages({
    'string.empty': 'El rol del usuario es obligatorio',
    'string.base': 'El rol del usuario debe ser admin, member o viewer',
  }),
});
