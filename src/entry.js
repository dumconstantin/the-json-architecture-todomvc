import './app.tag'
import app from './app.js'

baobabJsonEditor(app.state.tree)

riot.mount('#app', 'app')

module.hot.accept()
