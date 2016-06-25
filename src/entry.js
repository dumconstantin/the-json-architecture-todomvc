import * as Kefir from 'kefir'
import schema from 'lib/schema'
import makeState from 'lib/makeState'
import uiPatches from 'lib/uiPatches'
import uiSchema from 'lib/uiSchema'
import app from './app'

const state = makeState(schema)

const patches = Kefir.merge([uiPatches])

patches.onAny(state)













module.hot.accept()
