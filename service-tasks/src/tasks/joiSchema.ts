import * as Joi from 'joi';

const status = Joi.string().valid('to_do', 'doing', 'done');

export const taskCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  deadline: Joi.date().optional(),
  status: status.optional(),
});

export const taskUpdateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  deadline: Joi.date().optional(),
  status: status.optional(),
});

export const taskAssignSchema = Joi.object({
  userId: Joi.number().optional(),
  teamId: Joi.number().optional(),
});

export const taskUpdateStatusSchema = Joi.object({
  status: status.required(),
});
