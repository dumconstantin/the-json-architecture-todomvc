(function () {

  let helpers = {}

  helpers.log = R.curry((msg, x) => {
    console.log(msg, x)
    return x
  })

  window.helpers = helpers

}())
