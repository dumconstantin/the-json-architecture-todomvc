import ui from 'schema/ui'

const augment = curry((parentName, val, childName) => {
  return merge({
    selector: `.${parentName}-${childName}`,
    uid: `${parentName}-${childName}`,
    path: `/ui/${parentName}/data/${childName}`
  }, val)
})

const overNodes = (node, name) => mapObjIndexed(augment(name), node)

const viewUiSchema = schema => mapObjIndexed(overNodes, schema)

const uiSchema = viewUiSchema(ui)

export default uiSchema
