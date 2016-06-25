import { MonkeyDefinition, default as Baobab } from 'baobab'
import { dynamicNode, applyPatch, cursorOn, objFromSchema, cursorGet, cursorExists } from 'json-patch-utils'
import baobabJsEditor from 'baobab-jsoneditor'
import schema from 'lib/schema'
import updateView from 'lib/updateView'

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

const dynamicNodes = curry((tree, obj) => {
  mapObjIndexed(recursiveSet('dynamicNode', tree), obj)
})


let obj = objFromSchema(schema)
let tree = new Baobab(obj)
let patches = []
let patchTimers = {}
let nodeTimers = {}

let state = {
  tree: tree,
  get: cursorGet(tree),
  exists: cursorExists(tree),
  patch: patch => {
    if (patch.type === 'end') {
      return
    } else if (patch.type === 'error' || patch.type === 'value') {
      patch = patch.value
    }
    patches.push(patch)
    state.applyPatch(patch, 'data')
  },
  applyPatch: (patch, loc) => {
    try {
      if (!patchTimers[loc]) {
        patchTimers[loc] = []
      }
      let t0 = performance.now()

      applyPatch(tree, patch)

      patchTimers[loc].push([new Date().getTime(), performance.now() - t0])
    } catch (e) {
      console.error(`[patch apply error] ${loc} -> ${JSON.stringify(patch)}\n${e}`)
    }
  },
  dynamicNodes: dynamicNodes(tree),
  on: onUpdate(tree),
  onValue: (jsonPath, fn) => onUpdate(tree, jsonPath).onValue(fn),
  update: updateView(tree)
}

export default state
