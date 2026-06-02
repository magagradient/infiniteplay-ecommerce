const productCreateSchema = require('./productCreateSchema');
const productUpdateSchema = require('./productUpdateSchema');
const productSearchSchema = require('./productSearchSchema');
const deleteRelationSchema = require('./deleteRelationSchema');
const productRelationSchemas = require('./productRelationsSchemas');
const statusParamSchema = require('./statusParamSchema');
const idParamSchema = require('../shared/idParamSchema');
const productsArraySchema = require('./productsArraySchema');
const { assignRelationParamsSchema, assignRelationSchema } = require('./assignRelationSchema');

module.exports = {
  productCreateSchema,
  productSearchSchema,
  deleteRelationSchema,
  productRelationSchemas,
  statusParamSchema,
  idParamSchema,
  productsArraySchema,
  assignRelationParamsSchema,
  assignRelationSchema,
};