var state  = require('./lib/state.js').default
var uiSchema = require('./lib/uiSchema.js').default

console.log(uiSchema)
<app>

  <section class="todoapp">

    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" name="newTodo" data-path="{ schema.form.newTodo.path }" placeholder="What needs to be done?" value="{ data.newTodo }" autofocus>
    </header>

    <section if={ data.allNo > 0 } class="main">

      <input data-path="{ schema.todos.toggleAll.path }" data-value="{ '' + (!data.toggleAll) }" class="toggle-all" type="checkbox" checked={ data.activeNo === 0 || data.toggleAll }>
      <label for="toggle-all">Mark all as complete</label>

      <ul class="todo-list">
        <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->

        <li each={ data.todos } class="{ completed: completed }">
          <div class="view">
            <input data-path="{ schema.todos.toggle.path }" data-value="{ id }" class="toggle" type="checkbox" checked={ completed }>
            <label>{ title }</label>
            <button class="destroy" data-path="{ schema.todos.destroy.path }" data-value="{ id }"></button>
          </div>
          <input class="edit" value="{ title }">
        </li>

      </ul>

    </section>

    <footer if={ data.allNo > 0 } class="footer">

      <span class="todo-count"><strong>{ data.activeNo }</strong> item left</span>

      <ul class="filters">
        <li>
          <a class="{ selected: data.filter === 'all' }" href="#/" data-path="{ schema.todos.filter.path }" data-value="all">All</a>
        </li>
        <li>
          <a class="{ selected: data.filter === 'active' }" href="#/active" data-path="{ schema.todos.filter.path }" data-value="active">Active</a>
        </li>
        <li>
          <a class="{ selected: data.filter === 'completed' }" href="#/completed" data-path="{ schema.todos.filter.path }" data-value="completed">Completed</a>
        </li>
      </ul>

      <button if={ data.completedNo !== 0 } data-path="{ schema.todos.clearCompleted.path }" class="clear-completed">Clear completed</button>

    </footer>

  </section>

  this.schema = uiSchema

  state.update(this, {
    newTodo: '/ui/form/data/newTodo/value',
    allNo: ['/todos/all', length],
    activeNo: ['/todos/active', length],
    completedNo: ['/todos/completed', length],
    todos: '/ui/todos/filtered',
    filter: '/ui/todos/data/filter/value',
    toggleAll: '/ui/todos/data/toggleAll/value'
  })

</app>

