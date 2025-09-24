import Joi from 'joi';

export const contactCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),  
  photo: Joi.string().optional(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional(),
  photo: Joi.string().optional(),
});
