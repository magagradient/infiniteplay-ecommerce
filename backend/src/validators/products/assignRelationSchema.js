const Joi = require('joi');

const assignRelationParamsSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    relationType: Joi.string().valid("colors", "keywords", "styles", "themes").required()
});

const assignRelationSchema = Joi.object({
    ids: Joi.array().items(Joi.number().integer()).required()
});

module.exports = { assignRelationParamsSchema, assignRelationSchema };