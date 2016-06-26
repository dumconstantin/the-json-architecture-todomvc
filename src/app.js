import * as Kefir from 'kefir'
// import { makeSteate, uiSchema, uiPatches, schema, onUpdate } from 'lib'
import { createPatch as patch, dynamicNode as node } from 'json-patch-utils'
import { on, get, default as state } from 'lib/state'
import randomId from 'lib/randomId'
import onUpdate from 'lib/onUpdate'
import uiPatches from 'lib/uiPatches'
import ui from 'lib/uiSchema'
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
    completed: node(['/todos/all'], filter(propEq('completed', true))),
    isCompleted: node(['/todos/active'], isEmpty),
    editing: node(['/todos/all'], find(propEq('editing', true)))
  }
})

const newTodo = on('/ui/form/data/newTodo/value')
  .filter(pipe(isEmpty, not))
  .map(x => ({
    id: randomId(),
    title: x,
    completed: false,
    editing: false
  }))
  .map(x => [
    patch('add', `/todos/data/${x.id}`, x),
    patch('replace', '/ui/form/data/newTodo/value', '')
  ])

const destroyTodo = on('/ui/todos/data/destroy/value')
  .map(x => patch('remove', `/todos/data/${x}`, null))

const toggleTodo = on('/ui/todos/data/toggle')
  .filter(propSatisfies(pipe(isNil, not), 'value'))
  .map(x => `/todos/data/${x.value}/completed`)
  .map(x => patch('replace', x, not(get(x))))

const toggleAll = on('/ui/todos/data/toggleAll')
  .map(() => get('/todos/all'))
  .map(map(x => patch('replace', `/todos/data/${x.id}/completed`, not(get('/todos/isCompleted')))))

const editTitle = on(`${ui.todos.edit.path}/timestamp`)
  .map(() => get(`${ui.todos.edit.path}/value`))
  .map(x => patch('replace', `/todos/data/${x}/editing`, true))

const saveTitle = on('/ui/todos/data/newTitle/value')
  .map(x => patch('merge', `/todos/data/${get(`${ui.todos.edit.path}/value`)}`, {
    title: x,
    editing: false
  }))

const clearCompleted = on('/ui/todos/data/clearCompleted/timestamp')
  .flatten(() => get('/todos/completed'))
  .map(x => patch('remove', `/todos/data/${x.id}`, null))

Kefir.merge([
  uiPatches,
  newTodo,
  editTitle,
  saveTitle,
  destroyTodo,
  toggleTodo,
  toggleAll,
  clearCompleted
]).onAny(state.patch)

const app = {
  state: state
}

export default app
