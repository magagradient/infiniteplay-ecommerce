const Joi = require("joi");

const updateCouponSchema = Joi.object({
    code: Joi.string().trim().min(3).max(50),
    discount: Joi.number().positive().precision(2),
    discount_type: Joi.string().valid("fixed", "percentage"),
    expiration_date: Joi.date().iso(),
    max_uses: Joi.number().integer().positive().allow(null),
    is_active: Joi.boolean(),
    type: Joi.string().valid("general", "personalized")
})
    .min(1)
    .when(Joi.object({ discount_type: Joi.valid("percentage") }).unknown(), {
        then: Joi.object({
            discount: Joi.number().max(100)
                .messages({ "number.max": `Un descuento porcentual no puede superar 100.` })
        })
    })
    .messages({
        "object.min": "Debes proporcionar al menos un campo para actualizar."
    });

module.exports = updateCouponSchema;