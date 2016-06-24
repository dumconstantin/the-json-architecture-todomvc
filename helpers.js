(function () {
  let api = {}

  api.log = R.curry((msg, x) => {
      console.log(msg, x)
      return x
  })

  return api

}())
