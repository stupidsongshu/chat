import Vue from 'vue'
import Vuex from 'vuex'

import { Msg } from '@/types'

Vue.use(Vuex)

interface IUserChat {
  id: number
  list: Msg[]
}
interface IUserChatMap {
  [id: number]: Msg[]
}

export default new Vuex.Store({
  state: {
    contactUser: {},
    contactList: [],
    userChatMap: {} as IUserChatMap,
    userAccount: {}
  },
  mutations: {
    SET_CONTACT_USER (state, payload) {
      state.contactUser = payload
    },
    SET_CONTACT_LIST (state, payload) {
      state.contactList = payload
    },
    SET_USER_CHAT_MAP (state, payload: IUserChat) {
      state.userChatMap[payload.id] = payload.list
    },
    SET_USER_ACCOUNT (state, payload) {
      state.userAccount = payload
    },
  },
  actions: {},
  modules: {}
})
