const Joi = require('joi');

const productUpdateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .optional()
    .messages({
      'string.base': `"title" debe ser un texto`,
      'string.empty': `"title" no puede estar vacío`,
      'string.min': `"title" debe tener al menos {#limit} caracteres`,
      'string.max': `"title" no puede tener más de {#limit} caracteres`,
    }),
  description: Joi.string()
    .allow(null, '')
    .max(500)
    .optional()
    .messages({
      'string.base': `"description" debe ser un texto`,
      'string.max': `"description" no puede tener más de {#limit} caracteres`,
    }),
  artwork_level: Joi.string()
    .valid('experimental', 'signature', 'premium')
    .optional()
    .messages({
      'string.base': `"artwork_level" debe ser un texto`,
      'any.only': `"artwork_level" debe ser uno de estos valores: experimental, signature o premium`,
    }),
  price: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': `"price" debe ser un número`,
      'number.positive': `"price" debe ser un número positivo`,
    }),
  id_category: Joi.number()
    .integer()
    .allow(null)
    .optional()
    .messages({
      'number.base': `"id_category" debe ser un número`,
      'number.integer': `"id_category" debe ser un entero`,
    }),
  id_series: Joi.number()
    .integer()
    .allow(null)
    .optional()
    .messages({
      'number.base': `"id_series" debe ser un número`,
      'number.integer': `"id_series" debe ser un entero`,
    }),
  is_sold: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"is_sold" debe ser verdadero o falso`,
    }),
  sold_at: Joi.date()
    .allow(null, '')
    .optional()
    .messages({
      'date.base': `"sold_at" debe ser una fecha válida`,
    }),
  visible_in_portfolio: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': `"visible_in_portfolio" debe ser verdadero o falso`,
    }),
  keywords: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .messages({
      'array.base': `"keywords" debe ser un arreglo`,
      'number.base': `"keywords" debe contener ids numéricos`,
    }),
  colors: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .messages({
      'array.base': `"colors" debe ser un arreglo`,
      'number.base': `"colors" debe contener ids numéricos`,
    }),
  styles: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .messages({
      'array.base': `"styles" debe ser un arreglo`,
      'number.base': `"styles" debe contener ids numéricos`,
    }),
  themes: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .messages({
      'array.base': `"themes" debe ser un arreglo`,
      'number.base': `"themes" debe contener ids numéricos`,
    }),
});

module.exports = productUpdateSchema;
