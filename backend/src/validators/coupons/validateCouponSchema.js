const Joi = require("joi");

const validateCouponSchema = Joi.object({
    code: Joi.string().trim().min(3).max(50).required()
        .messages({
            "string.base": `"code" debe ser una cadena.`,
            "string.empty": `"code" no puede estar vacío.`,
            "string.min": `"code" debe tener al menos 3 caracteres.`,
            "string.max": `"code" no puede exceder los 50 caracteres.`,
            "any.required": `"code" es obligatorio.`
        }),
    id_user: Joi.number().integer().positive().required()
        .messages({
            "number.base": `"id_user" debe ser un número.`,
            "number.integer": `"id_user" debe ser un número entero.`,
            "number.positive": `"id_user" debe ser positivo.`,
            "any.required": `"id_user" es obligatorio.`
        })
});

module.exports = validateCouponSchema;