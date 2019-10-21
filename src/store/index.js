import Vuex from 'vuex'
import Vue from 'vue'

import controller from './modules/controller'

Vue.use(Vuex)

export default new Vuex.Store({
    modules : {
        controller
    }
  })