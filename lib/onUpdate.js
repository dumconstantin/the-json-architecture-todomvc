import { cursorOn } from 'json-patch-utils'

const onUpdate = curry((state, jsonPath, fn) => {
  return cursorOn(state, 'update', jsonPath)
  .filter(pipe(isNil, not))
  .filter(ifElse(is(Object), pipe(isEmpty, not), always(true)))
  .onValue(fn)
})

export default onUpdate

