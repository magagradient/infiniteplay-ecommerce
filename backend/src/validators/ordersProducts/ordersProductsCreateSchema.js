const Joi = require("joi");

const ordersProductsCreateSchema = Joi.object({
    id_order: Joi.number().integer().positive().required().messages({
        "number.base": `'id_order' debe ser un número.`,
        "number.integer": `'id_order' debe ser un número entero.`,
        "number.positive": `'id_order' debe ser un número positivo.`,
        "any.required": `'id_order' es obligatorio.`,
    }),
    id_product: Joi.number().integer().positive().required().messages({
        "number.base": `'id_product' debe ser un número.`,
        "number.integer": `'id_product' debe ser un número entero.`,
        "number.positive": `'id_product' debe ser un número positivo.`,
        "any.required": `'id_product' es obligatorio.`,
    }),
    quantity: Joi.number().integer().positive().default(1).messages({
        "number.base": `'quantity' debe ser un número.`,
        "number.integer": `'quantity' debe ser un número entero.`,
        "number.positive": `'quantity' debe ser un número positivo.`,
    }),
    unit_price: Joi.number().precision(2).positive().required().messages({
        "number.base": `'unit_price' debe ser un número.`,
        "number.positive": `'unit_price' debe ser un número positivo.`,
        "any.required": `'unit_price' es obligatorio.`,
    }),
    applied_discount_percentage: Joi.number().min(0).max(100).default(0).messages({
        "number.base": `'applied_discount_percentage' debe ser un número.`,
        "number.min": `'applied_discount_percentage' no puede ser negativo.`,
        "number.max": `'applied_discount_percentage' no puede ser mayor a 100.`,
    }),
});

module.exports = ordersProductsCreateSchema;