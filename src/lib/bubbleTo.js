const bubbleTo = curry((selector, e) => {
  let el = e.target

  while (!el.matches(selector) && !el.matches('body')) {
    el = el.parentElement
  }

  if (el.matches('body')) {
    el = null
  }

  return el
})

export default bubbleTo
