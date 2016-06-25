import modelUiSchema from 'lib/modelUiSchema'
import objectMerge from 'object-merge'
import { derefSchema } from 'json-patch-utils'

const makeSchema = x => {
  let schema = objectMerge(x.data, modelUiSchema(x.ui))
  schema = derefSchema(schema)
  return schema
}

export default makeSchema
