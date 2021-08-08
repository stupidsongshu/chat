<template>
  <div class="page page-home">
    <el-container class="page-container">
      <el-aside class="page-aside" width="330px">
        <ContactList ref="contactListRef" :socket="socket" :user="contactUser" @openSocket="openSocket"></ContactList>
      </el-aside>
      <el-main class="page-main">
        <el-header class="page-header">
          <ContactUserHeader ref="contactUserHeaderRef" :socket="socket" :user="contactUser"></ContactUserHeader>
        </el-header>
        <el-main class="chat-main">
          <ContactUserMain ref="contactUserMainRef" :socket="socket" :user="contactUser"></ContactUserMain>
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

import ContactList from './component/contact-list.vue'
import ContactUserHeader from './component/contact-user-header.vue'
import ContactUserMain from './component/contact-user-main.vue'
import ChatEdit from './component/chat-edit.vue'

import { getWsURL } from '@/utils'
import ws from '@/utils/ws'
import { ContactUser, Msg } from '@/types'

let heartTimer = 0
let reConnectCount = 0 // 断开重连次数

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
  socket: WebSocket | null = null

  @Ref() readonly contactListRef!: ContactList
  @Ref() readonly contactUserHeaderRef!: ContactUserHeader
  @Ref() readonly contactUserMainRef!: ContactUserMain

  get contactUser (): ContactUser {
    return this.$store.state.contactUser
  }

  mounted (): void {
    this.openSocket()
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
    const socket = new WebSocket(socketUrl)
    this.socket = socket
    // console.log(this.socket)
    socket.onopen = () => {
      console.log('websocket onopen')
      // 每10秒发送心跳
      if (heartTimer) {
        clearInterval(heartTimer)
      }
      heartTimer = setInterval(() => {
        socket.send(JSON.stringify({ action: '心跳' }))
      }, 10000)
    }
    socket.onmessage = (msg) => {
      // console.log('websocket onmessage:', msg)
      let res = msg.data
      if (res === '连接成功') {
        this.contactListRef.ws_send_contactList()
      } else {
        try {
          res = JSON.parse(res)
          // console.log('onmessage msg.data:', res)
          switch (res.action) {
            // 联系人列表
            case ws.contactList.receive:
              this.contactListRef.ws_receive_contactList(res.obj)
              break
            // 聊天记录
            case ws.msgList.receive:
              this.contactUserMainRef.ws_receive_getMsgList(res.obj)
              break
            // 账户信息
            case ws.account.receive:
              res.obj.tag = res.tag
              this.contactUserHeaderRef.ws_receive_getAccount(res.obj)
              break
            // 发送消息 消息保存数据库成功后状态 status 为 0
            case 'msg':
              this.socketNewMsg(res.obj)
              break
            // 收到新消息
            case 'newMsg':
              this.socketNewMsg(res.obj)
              break
            default:
              // 消息发送成功后状态 status 变更为 2
              this.socketNewMsg(res)
              break
          }
        } catch (error) {
          // console.error(error)
        }
      }
    }
    socket.onclose = (err) => {
      console.warn('websocket onclose:', err)
      // 断开重连
      console.log('断开重连...', ++reConnectCount)
      this.openSocket()
      // if (reConnectCount < 10) {
      //   reConnectCount++
      //   // this.$message({
      //   //   type: 'warning',
      //   //   message: `正在尝试第${reConnectCount}次连接服务`
      //   // })
      //
      //   this.openSocket()
      // } else {
      //   this.$alert('服务连接失败，请刷新页面或稍后重试', '提示', {
      //     type: 'error',
      //     confirmButtonText: '确定',
      //     callback: () => {
      //       window.location.reload()
      //     }
      //   })
      // }
    }
    socket.onerror = (err) => {
      console.error('websocket onerror:', err)
    }
  }

  sendMsg (msg: Msg): void {
    if (!this.isSupportWs()) return
    this.socket?.send(JSON.stringify(msg))
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
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0;
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
