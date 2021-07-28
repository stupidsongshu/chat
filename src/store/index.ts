import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contactUser: {},
    contactList: [],
    userChatMap: {}
  },
  mutations: {
    SET_CONTACT_USER (state, payload) {
      state.contactUser = payload
    },
    SET_CONTACT_LIST (state, payload) {
      state.contactList = payload
    },
    SET_USER_CHAT_MAP_LIST (state, payload) {
      // state.userChatMap[payload.id] = payload.list
      state.userChatMap = payload
    },
  },
  actions: {},
  modules: {}
})
