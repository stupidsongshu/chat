import Vue from 'vue'
import Vuex from 'vuex'

import { getContactList } from '@/utils/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contactUser: {}
  },
  mutations: {
    SET_CONTACT_USER (state, payload) {
      state.contactUser = payload
    }
  },
  actions: {
    // async GetContactList ({ commit }): Promise<Array<any>> {
    // }
  },
  modules: {
  }
})
