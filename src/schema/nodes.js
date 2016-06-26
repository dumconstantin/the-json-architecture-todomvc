import { dynamicNode as node } from 'json-patch-utils'

export default {
  ui: {
    todos: {
      filtered: node(['/ui/todos/data/filter/value', '/todos'], prop)
    }
  },
  todos: {
    all: node(['/todos/data'], values),
    active: node(['/todos/all'], filter(propEq('completed', false))),
    completed: node(['/todos/all'], filter(propEq('completed', true))),
    isDone: node(['/todos/active'], isEmpty),
    editing: node(['/todos/all'], find(propEq('editing', true)))
  }
}
