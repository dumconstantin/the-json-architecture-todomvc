import * as Kefir from 'kefir'
// import { makeSteate, uiSchema, uiPatches, schema, onUpdate } from 'lib'
import { createPatch as patch, dynamicNode as node } from 'json-patch-utils'
import state from 'lib/state'
import randomId from 'lib/randomId'
import onUpdate from 'lib/onUpdate'
import uiPatches from 'lib/uiPatches'
import log from 'lib/log'

window.state = state

state.dynamicNodes({
  ui: {
    todos: {
      filtered: node(['/ui/todos/data/filter/value', '/todos'], prop)
    }
  },
  todos: {
    all: node(['/todos/data'], values),
    active: node(['/todos/all'], filter(propEq('completed', false))),
    completed: node(['/todos/all'], filter(propEq('completed', true)))
  }
})

const newTodo = state.on('/ui/form/data/newTodo/value')
  .filter(pipe(isEmpty, not))
  .map(x => ({
    id: randomId(),
    title: x,
    completed: false
  }))
  .map(x => [
    patch('add', `/todos/data/${x.id}`, x),
    patch('replace', '/ui/form/data/newTodo/value', '')
  ])

const destroyTodo = state.on('/ui/todos/data/destroy/value')
  .map(x => patch('remove', `/todos/data/${x}`, null))

const toggleTodo = state.on('/ui/todos/data/toggle')
  .filter(propSatisfies(pipe(isNil, not), 'value'))
  .map(x => `/todos/data/${x.value}/completed`)
  .map(x => patch('replace', x, not(state.get(x))))

const toggleAll = state.on('/ui/todos/data/toggleAll/value')


const clearCompleted = state.on('/ui/todos/data/clearCompleted/timestamp')
  .map(x => map(prop('id'), state.get('/todos/completed')))
  .flatten()
  .map(x => patch('remove', `/todos/data/${x}`, null))

Kefir.merge([
  uiPatches,
  newTodo,
  destroyTodo,
  toggleTodo,
  clearCompleted
]).onAny(state.patch)

const app = {
  state: state
}

export default app
