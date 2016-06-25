import modelUiSchema from 'lib/modelUiSchema'
import objectMerge from 'object-merge'
import { derefSchema } from 'json-patch-utils'
import data from 'schema/data'
import ui from 'schema/ui'

let schema = objectMerge(data, modelUiSchema(ui))
schema = derefSchema(schema)

export default schema
