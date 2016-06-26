import { patch as patchState, tree } from 'lib/state'
import uiPatches from 'lib/uiPatches'
import appPatches from './app.js'
import './app.tag'

appPatches.onValue(patchState)
uiPatches.onValue(patchState)

riot.mount('#app', 'app')
