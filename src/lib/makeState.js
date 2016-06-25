import { default as Baobab } from 'baobab'
import { objFromSchema, cursorGet, cursorExists } from 'json-patch-utils'
import baobabJsEditor from 'baobab-jsoneditor'

const dynamicNodeWrapper = args => {
  let id = args[0]
  let paths = args[1]
  let fn = args[2]

  function wrapper(fn) {
    return unapply(args => {
      let t0 = performance.now()

      let result = fn.apply(null, args)

      nodeTimers[id].push([new Date().getTime(), performance.now() - t0])

      return result
    })
  }

  if (!nodeTimers[id]) {
    nodeTimers[id] = []
  }

  fn = wrapper(fn)

  return dynamicNode(paths, fn)
}

const makeState = schema => {
  let tree = new Baobab(objFromSchema(schema))
  let patches = []
  let patchTimers = {}

  let state = {
    get: cursorGet(tree),
    exists: cursorExists(tree),
    patch: patch => {
      if (patch.type === 'end') {
        return
      } else if (patch.type === 'error' || patch.type === 'value') {
        patch = patch.value
      }
      patches.push(patch)
      state.applyPatch(patch.patch, patch.file)
    },
    applyPatch: (patch, loc) => {
      try {
        if (!patchTimers[loc]) {
          patchTimers[loc] = []
        }
        let t0 = performance.now()

        applyPatch(state, patch)

        patchTimers[loc].push([new Date().getTime(), performance.now() - t0])
      } catch (e) {
        console.error(`[patch apply error] ${loc} -> ${JSON.stringify(patch)}\n${e}`)
      }
    }
  }

  return state
}

export default makeState
