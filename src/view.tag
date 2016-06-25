
export default View => {

  <app>

    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" autofocus>
      </header>
      <!-- This section should be hidden by default and shown when there are todos -->
      <section class="main">
        <input class="toggle-all" type="checkbox">
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <!-- These are here just to show the structure of the list items -->
          <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
          <li class="completed">
            <div class="view">
              <input class="toggle" type="checkbox" checked>
              <label>Taste JavaScript</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" value="Create a TodoMVC template">
          </li>
          <li>
            <div class="view">
              <input class="toggle" type="checkbox">
              <label>Buy a unicorn</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" value="Rule the web">
          </li>
        </ul>
      </section>
      <!-- This footer should hidden by default and shown when there are todos -->
      <footer class="footer">
        <!-- This should be `0 items left` by default -->
        <span class="todo-count"><strong>0</strong> item left</span>
        <!-- Remove this if you don't implement routing -->
        <ul class="filters">
          <li>
            <a class="selected" href="#/" data-id="all">All</a>
          </li>
          <li>
            <a href="#/active" data-id="active">Active</a>
          </li>
          <li>
            <a href="#/completed" data-id="completed">Completed</a>
          </li>
        </ul>
        <!-- Hidden if no completed items are left ↓ -->
        <button class="clear-completed">Clear completed</button>
      </footer>
    </section>

    self.on('mount', () => {

      model.onValue('/ui/form/data/input/value', setInput(self.root, 'wager'))

    })


    View.data(this, {
      todos: '/todos/',
      activeFilter: '/ui/filter'
    })

  </app>

}

