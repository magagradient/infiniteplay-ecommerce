const Joi = require('joi');

const productSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': `"title" debe ser un texto`,
      'string.empty': `"title" no puede estar vacío`,
      'string.min': `"title" debe tener al menos {#limit} caracteres`,
      'string.max': `"title" no puede tener más de {#limit} caracteres`,
      'any.required': `"title" es obligatorio`
    }),
  description: Joi.string()
    .allow(null, '')
    .max(500)
    .messages({
      'string.base': `"description" debe ser un texto`,
      'string.max': `"description" no puede tener más de {#limit} caracteres`,
    }),
  description_long: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': `"description_long" debe ser un texto`,
    }),
  price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': `"price" debe ser un número`,
      'number.positive': `"price" debe ser un número positivo`,
      'any.required': `"price" es obligatorio`
    }),
  id_category: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': `"id_category" debe ser un número`,
      'number.integer': `"id_category" debe ser un entero`,
      'any.required': `"id_category" es obligatorio`
    }),
  id_series: Joi.number()
    .integer()
    .allow(null)
    .messages({
      'number.base': `"id_series" debe ser un número`,
      'number.integer': `"id_series" debe ser un entero`,
    }),
  is_sold: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': `"is_sold" debe ser verdadero o falso`
    }),
  sold_at: Joi.date()
    .allow(null)
    .messages({
      'date.base': `"sold_at" debe ser una fecha válida`
    }),
});


module.exports = productSchema;
