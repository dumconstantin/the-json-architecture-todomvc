import * as Kefir from 'kefir'
import $ from 'jquery'

const domOn = curry((action, cssSelector) => {
  return Kefir.stream(emitter => {
    $(document).on(action, cssSelector, emitter.emit)
  })
})

export default domOn
