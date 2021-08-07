import Vue from 'vue'
import Vuex from 'vuex'
import { Account, Msg, ContactUser } from '@/types'

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
    contactUser: {} as ContactUser,
    contactList: [] as ContactUser[],
    accountList: [] as Account[],
    userChatMap: {} as IUserChatMap
  },
  mutations: {
    SET_CONTACT_USER (state, payload: ContactUser) {
      state.contactUser = payload
    },
    SET_CONTACT_LIST (state, payload: ContactUser[]) {
      state.contactList = payload
    },
    SET_ACCOUNT_LIST (state, payload: Account) {
      const index = state.accountList.findIndex(item => item.id === payload.id)
      if (index === -1) {
        state.accountList.push(payload)
      } else {
        state.accountList.splice(index, 1, payload)
      }
    },
    SET_USER_CHAT_MAP (state, payload: IUserChat) {
      state.userChatMap[payload.id] = payload.list
    }
  },
  actions: {},
  modules: {}
})
