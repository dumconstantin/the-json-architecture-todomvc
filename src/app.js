import * as Kefir from 'kefir'
import { createPatch as patch } from 'json-patch-utils'
import { on, get, default as state } from 'lib/state'
import randomId from 'lib/randomId'
import log from 'lib/log'

export default Kefir.merge([

  on('/ui/todos/data/newTodo/value')
    .filter(pipe(isEmpty, not))
    .map(x => ({
      id: randomId(),
      title: x,
      completed: false,
      editing: false
    }))
    .map(x => [
      patch('add', `/todos/data/${x.id}`, x),
      patch('replace', '/ui/todos/data/newTodo/value', '')
    ]),

  on('/ui/todos/data/destroy/value')
    .map(x => patch('remove', `/todos/data/${x}`, null)),

  on('/ui/todos/data/toggle/timestamp')
    .map(() => `/todos/data/${get('/ui/todos/data/toggle/value')}/completed`)
    .map(x => patch('replace', x, not(get(x)))),

  on('/ui/todos/data/toggleAll/timestamp').map(() => ({
      todos: map(prop('id'), get('/todos/all')),
      status: not(get('/todos/isDone'))
    }))
    .map(x => map(id => patch('replace', `/todos/data/${id}/completed`, x.status), x.todos)),

  on('/ui/todos/data/edit/timestamp')
    .map(() => get('/ui/todos/data/edit/value'))
    .map(x => patch('replace', `/todos/data/${x}/editing`, true)),

  on('/ui/todos/data/newTitle/value')
    .map(x => ({
      id: get('/ui/todos/data/edit/value'),
      title: x,
      editing: false
    }))
    .map(x => patch('merge', `/todos/data/${x.id}`, x)),

  on('/ui/todos/data/clearCompleted/timestamp')
    .flatten(() => get('/todos/completed'))
    .map(x => patch('remove', `/todos/data/${x.id}`, null))

])
