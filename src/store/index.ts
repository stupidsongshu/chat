import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contactUser: {},
    contactList: []
  },
  mutations: {
    SET_CONTACT_USER (state, payload) {
      state.contactUser = payload
    },
    SET_CONTACT_LIST (state, payload) {
      state.contactList = payload
    }
  },
  actions: {},
  modules: {}
})
