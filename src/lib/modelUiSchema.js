
const toDrop = ['type', 'data']

const createData = curry((obj, acc, x) => {
  let el = obj[x]

  if (propEq('data', true, el)) {
    let value = omit(toDrop, el)

    switch (prop('type', el)) {
      case 'email':
        value.type = 'email, null'
        break
      case 'password':
        value.type = 'string, null'
        value.pattern = '^(?=.*?[A-Z])(?=.*?[a-z]).{8,}$'
        break
      case 'number':
        value.type = 'number, null'
        break
      case 'button':
        value.type = 'string, null'
        break
      case 'modal':
        value.type = 'array'
        break
      case 'boolean':
        value.type = 'boolean'
        break
      case 'string':
        value.type = 'string, null'
        break
    }

    acc[x] = {
      type: 'object',
      properties: {
        timestamp: {
          '$ref': '#/definitions/timestamp'
        },
        value: value
      }
    }
  }

  return acc
})

const overNodes = curry((acc, key, schema) => {
  let obj = prop(key, schema)

  let data = reduce(createData(obj), {}, keys(obj))

  if (not(isEmpty(data))) {
    acc[key] = {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: data
        }
      }
    }
  }

  return acc
})

const modelUiSchema = schema => {
  let data = reduce(overNodes(__, __, schema), {}, keys(schema))
  return {
    properties: {
      ui: {
        type: 'object',
        properties: data
      }
    }
  }
}


export default modelUiSchema
