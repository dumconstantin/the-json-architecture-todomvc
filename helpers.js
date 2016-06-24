let a = R.curry((msg, x) => {
      console.log(msg, x)
      return x
})

module.exports = a

