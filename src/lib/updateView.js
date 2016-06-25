import { cursorOn, cursorGet } from 'json-patch-utils'

const parseCursors = v => {
  return {
    path: is(String, v) ? v : v[0],
    fn: is(String, v) ? identity : v[1] ? v[1] : identity,
    off: T
  }
}

const updateCtx = curry((ctx, name, fn, data) => {
  ctx.data[name] = fn(data)
  ctx.update()
  return data
})

const setWatcher = curry((tree, ctx, cursor, name) => {
  let currentValue = cursorGet(tree, cursor.path)

  updateCtx(ctx, name, cursor.fn, currentValue)

  cursor.stream = cursorOn(tree, 'update', cursor.path)
  cursor.stream.onValue(updateCtx(ctx, name, cursor.fn))

  return cursor
})

const updateView = curry((tree, ctx, a) => {
  let cursors = map(parseCursors, a)

  ctx.on('mount', () => {
    cursors = mapObjIndexed(setWatcher(tree, ctx), cursors)
  })

  ctx.on('unmount', () => {
    map(cursor => cursor.stream.offValue(), cursors)
  })

  ctx.data = {}
})

export default updateView
