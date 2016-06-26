import * as Kefir from 'kefir'
import { createPatch as patch } from 'json-patch-utils'
import { newTodo, destroy, toggle, toggleValue, toggleAll, edit, editValue, newTitle, clearCompleted } from 'lib/uiPaths'
import { on, get, default as state } from 'lib/state'
import uiPatches from 'lib/uiPatches'
import randomId from 'lib/randomId'

const patches = Kefir.merge([
  on(newTodo)
    .filter(pipe(isEmpty, not))
    .map(x => ({
      id: randomId(),
      title: x,
      completed: false,
      editing: false
    }))
    .map(x => [
      patch('add', `/todos/data/${x.id}`, x),
      patch('replace', newTodo, '')
    ]),
  on(destroy)
    .map(x => patch('remove', `/todos/data/${x}`, null)),
  on(toggle)
    .map(() => `/todos/data/${get(toggleValue)}/completed`)
    .map(x => patch('replace', x, not(get(x)))),
  on(toggleAll).map(() => ({
      todos: map(prop('id'), get('/todos/all')),
      status: not(get('/todos/isDone'))
    }))
    .map(x => map(id => patch('replace', `/todos/data/${id}/completed`, x.status), x.todos)),
  on(edit)
    .map(() => get(editValue))
    .map(x => patch('replace', `/todos/data/${x}/editing`, true)),
  on(newTitle)
    .map(x => ({
      id: get(editValue),
      title: x,
      editing: false
    }))
    .map(x => patch('merge', `/todos/data/${x.id}`, x)),
  on(clearCompleted)
    .flatten(() => get('/todos/completed'))
    .map(x => patch('remove', `/todos/data/${x.id}`, null))
])

patches.onValue(state.patch)
uiPatches.onValue(state.patch)

require('./app.tag')
riot.mount('#app', 'app')
