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
    userChatMap: {} as IUserChatMap
    // userChatMap: [] as IUserChat[]
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
      // const index = state.userChatMap.findIndex(item => item.id === payload.id)
      // if (index === -1) {
      //   state.userChatMap.push(payload)
      // } else {
      //   // const userChatItem = state.userChatMap[index]
      //   state.userChatMap [index] = payload
      // }
    },
  },
  actions: {},
  modules: {}
})
