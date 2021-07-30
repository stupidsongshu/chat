<template>
  <div class="page page-home">
    <el-container class="page-container">
      <el-aside class="page-aside" width="330px">
        <ContactList ref="contactListRef" :user="contactUser" @openSocket="openSocket"></ContactList>
      </el-aside>
      <el-main class="page-main">
        <el-header class="page-header">
          <ContactUserHeader :user="contactUser"></ContactUserHeader>
        </el-header>
        <el-main class="chat-main">
          <ContactUserMain ref="contactUserMainRef" :user="contactUser"></ContactUserMain>
        </el-main>
        <el-footer class="page-footer" style="height: 200px;">
          <ChatEdit :user="contactUser" @sendMsg="sendMsg"></ChatEdit>
        </el-footer>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'

import ContactList from './component/contact-list.vue'
import ContactUserHeader from './component/contact-user-header.vue'
import ContactUserMain from './component/contact-user-main.vue'
import ChatEdit from './component/chat-edit.vue'

import { getWsURL } from '@/utils'

import { ContactUser, Msg } from '@/types'

let socket: WebSocket
let heartTimer = 0

@Component({
  components: {
    ContactList,
    ContactUserHeader,
    ContactUserMain,
    ChatEdit
  },
})
export default class Home extends Vue {
  // chatSaving = false // TODO 待优化 发送的消息是否正在保存

  @Ref() readonly contactListRef!: ContactList
  @Ref() readonly contactUserMainRef!: ContactUserMain

  get contactUser (): ContactUser {
    return this.$store.state.contactUser
  }
  get contactList (): ContactUser[] {
    return this.$store.state.contactList
  }

  isSupportWs (): boolean {
    if (typeof(WebSocket) === 'undefined') {
      console.error('您的浏览器不支持WebSocket')
      this.$message({
        message: '您的浏览器不支持WebSocket，建议升级或更换浏览器后重试',
        type: 'error'
      })
      return false
    }
    return true
  }

  openSocket (): void {
    if (!this.isSupportWs()) return
    const socketUrl = getWsURL()
    socket = new WebSocket(socketUrl)
    socket.onopen = () => {
      console.log('websocket onopen')
      // 每10秒发送心跳
      if (heartTimer) {
        clearInterval(heartTimer)
      }
      heartTimer = setInterval(() => {
        socket.send(JSON.stringify({
          action: '心跳'
        }))
      }, 10000)
    }
    socket.onmessage = (msg) => {
      // console.log('websocket onmessage:', msg)
      let res = msg.data
      //发现消息进入 开始处理前端触发逻辑
      try {
        res = JSON.parse(res)
        // console.log('onmessage msg.data:', res)
        switch (res.action) {
          // 联系人列表
          case 'contactList':
            this.socketContactList(res.obj.list)
            break
          // 发送消息
          case 'msg':
            this.socketNewMsg(res.obj)
            break
          // 收到新消息
          case 'newMsg':
            this.socketNewMsg(res.obj)
            break
        }
      } catch (error) {
        // console.warn(error)
      }
    }
    socket.onclose = (err) => {
      console.warn('websocket onclose:', err)
      // 断开重连
      console.log('断开重连...')
      this.openSocket()
    }
    socket.onerror = (err) => {
      console.error('websocket onerror:', err)
    }
  }

  sendMsg (msg: Msg): void {
    if (!this.isSupportWs()) return
    socket.send(JSON.stringify(msg))
  }

  socketContactList (newList: ContactUser[]): void {
    // 去重
    const tmpList: ContactUser[] = []
    const oldList = cloneDeep(this.contactList)
    oldList.forEach((item: ContactUser) => {
      const isInclude = newList.find(newItem => newItem.id === item.id)
      if (!isInclude) {
        tmpList.push(item)
      }
    })
    // console.warn('newList:', newList)
    // console.warn('oldList:', oldList)
    // console.warn('tmpList:', tmpList)
    const list = newList.concat(tmpList)
    this.$store.commit('SET_CONTACT_LIST', list)
  }

  socketNewMsg (msg: Msg): void {
    if (this.contactUser.userId === msg.userId && this.contactUser.dscUserId === msg.dscUserId) {
      this.contactUserMainRef.updateNewMsg(msg)
    }
  }
}
</script>

<style scoped>
.page-home {
  /* padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px; */
  /* padding-bottom: 200px; */
}
.page-container {
  position: relative;
  /* border: 1px solid #ddd; */
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.page-aside {
  /* height: 100vh; */
  border-right: 1px solid #ddd;
}
/* .page-header {
  display: flex;
  align-items: center;
} */
.page-main {
  display: flex;
  flex-direction: column;
  padding: 0;
  /* padding-top: 60px;
  padding-bottom: 200px; */
}
.chat-main {
  /* height: 100vh; */
  height: calc(100vh - 260px);
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.page-footer {
  height: 100px;
}

@media screen and (max-width: 480px) {
  .page-aside {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #fff;
  }
}
</style>
