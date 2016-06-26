import * as Kefir from 'kefir'
import { createPatch } from 'json-patch-utils'
import preventDefault from 'lib/preventDefault'
import bubbleTo from 'lib/bubbleTo'
import domOn from 'lib/domOn'
import $ from 'jquery'
import schema from 'lib/schema'
import log from 'lib/log'

const patches = Kefir.merge([
    domOn('click', 'a[data-path]'),
    domOn('change', 'input[data-path]'),
    domOn('change', 'select[data-path]'),
    domOn('click', 'button[data-path]'),
    domOn('dblclick', 'li[data-path]')
  ])
  .map(preventDefault)
  .map(bubbleTo('[data-path]'))
  .map(x => ({
    path: $(x).attr('data-path'),
    value: $(x).attr('data-value') || $(x).val()
  }))
  .map(x => {
    let schemaPath = pipe(
      split('/'),
      intersperse('properties'),
      reject(isEmpty),
      append('properties'),
      append('value'),
      append('type')
    )(x.path)

    let valType = path(schemaPath, schema)

    let patch
    if (valType) {
      if ("number" === valType) {
        x.value = defaultTo('', parseFloat(x.value))
      } else if ('boolean' === valType) {
        if (x.value === 'true') {
          x.value = true
        } else if (x.value === 'false') {
          x.value = false
        }
      }
      patch = createPatch('merge', x.path, {
        timestamp: new Date().getTime(),
        value: x.value
      })

    } else {
      patch = createPatch('add', x.path, x.value)
    }

    return patch
  })

export default patches
