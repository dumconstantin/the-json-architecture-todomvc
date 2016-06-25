import modelUiSchema from 'lib/modelUiSchema'
import ui from 'schema/ui'
import data from 'schema/data'
import objectMerge from 'object-merge'
import { derefSchema } from 'json-patch-utils'

let schema = objectMerge(data, modelUiSchema(ui))
schema = derefSchema(schema)

export default schema
