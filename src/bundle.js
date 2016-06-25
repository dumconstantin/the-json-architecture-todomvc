import * as Kefir from 'kefir'
import schema from 'lib/schema'
import makeState from 'lib/makeState'
import uiPatches from 'lib/uiPatches'
import uiSchema from 'lib/uiSchema'

const state = makeState(schema)

const patches = Kefir.merge([uiPatches])















module.hot.accept()
