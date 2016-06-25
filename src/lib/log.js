
const log = curry((msg, x) => {
  console.log(msg, x)
  return x
})

export default log
