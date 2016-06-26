import { MonkeyDefinition, default as Baobab } from 'baobab'
import { dynamicNode, applyPatch, cursorOn, objFromSchema, cursorGet, cursorExists } from 'json-patch-utils'
import baobabJsEditor from 'baobab-jsoneditor'
import schema from 'lib/schema'
import updateView from 'lib/updateView'
import nodes from 'schema/nodes'

const onUpdate = curry((state, jsonPath) => {
  return cursorOn(state, 'update', jsonPath)
  .filter(pipe(isNil, not))
  .filter(ifElse(is(Object), pipe(isEmpty, not), always(true)))
  .delay(20)
})

const recursiveSet = curry((id, tree, v, k) => {
  if (is(Object, v) && is(MonkeyDefinition, v)) {
    tree.set(k, v)
  } else if (is(Object, v)) {
    mapObjIndexed(recursiveSet(`${id}${k}.`, tree.select(k)), v)
  } else {
    throw 'Values are not allowed. Use a dynamic node instead'
  }
})

let obj = objFromSchema(schema)
let tree = new Baobab(obj)
let patches = []
let patchTimers = {}
let nodeTimers = {}

baobabJsonEditor(tree)

const get = cursorGet(tree)
const exists = cursorExists(tree)
const patch = patch => {
  if (patch.type === 'end') {
    return
  } else if (patch.type === 'error' || patch.type === 'value') {
    patch = patch.value
  }
  patches.push(patch)
  applyPatch(tree, patch)
}

const dynamicNodes = obj => mapObjIndexed(recursiveSet('dynamicNode', tree), obj)
const on = onUpdate(tree)
const onValue = (jsonPath, fn) => onUpdate(tree, jsonPath).onValue(fn)
const data = updateView(tree)

dynamicNodes(nodes)


export { get, on, patch }

export default {
  tree,
  on,
  onValue,
  data,
  get,
  exists,
  patch,
  dynamicNodes
}
