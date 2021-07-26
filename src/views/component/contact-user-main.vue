<template>
  <ul id="chat-container" class="chat-record">
    <li v-scroll-to="'#chat-'+chatId"> 
      <a href="#" v-scroll-to="'#chat-'+chatId">Scroll to {{chatId}}</a>
    </li>
    <li v-if="inited" id="prev-msg" class="msg-item" style="justify-content:center;">
      <el-link v-if="!noMore" type="primary" @click="doGetMsgList">上一页</el-link>
      <span v-else style="font-size:12px;color:#999;">没有更多了</span>
    </li>
    <li
      v-for="item in list"
      :key="item.id"
      class="msg-item"
      :class="{'msg-send': item.direction === 0, 'msg-receive': item.direction === 1}"
      :id="'chat-' + item.id">
      <!-- direction: 0-我方发送 1-粉丝发送 -->
      <el-avatar shape="square" v-if="item.direction === 1" :size="36"></el-avatar>
      <!-- <div class="msg-content">{{formatTime(item.sendTime)}} {{item.msgCn}}</div> -->
      <!-- 纯文本 -->
      <div v-if="item.type === 'text'" class="msg-content">
        {{item.msgCn || ' '}}
      </div>
      <!-- 含链接 -->
      <div v-else-if="item.type === 'link'" class="msg-content" v-html="item.linkMsg"></div>
      <!-- 图片 -->
      <div v-else-if="item.type === 'media'">
        <img :src="item.url" class="msg-msg" alt="">
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { ContactUser, Msg } from '@/types'
import { getMsgList } from '@/utils/api'
import { urlRegExp } from '@/utils'

@Component
export default class ContactUserMain extends Vue {
  inited = false
  loading = false
  pageNo = 1
  totalNum = 0
  list: Msg[] = []
  chatId = 0

  @Prop() user!: ContactUser

  get noMore (): boolean {
    return this.inited && (this.list.length >= this.totalNum)
  }

  @Watch('user.id', { immediate: false, deep: false })
  onUserIdChange(): void {
    console.warn('onUserIdChange')
    this.resetCondition()
    this.doGetMsgList()
  }

  updateNewMsg (msg: Msg): void {
    // 去重：防止多次插入同一条消息
    // if (this.list.find(item => item.id === msg.id)) return
    // 处理消息
    const list = this.handleMsg([msg])
    // 拼接消息
    this.list = this.list.concat(list)
    // TODO 滚动到底部
  }

  async doGetMsgList (): Promise<void> {
    if (this.noMore) return
    this.loading = true
    const [err, res] = await getMsgList(this.user.userId, this.user.dscUserId, this.pageNo, 20)
    this.loading = false
    if (err) return
    const { data } = res
    if (!data) return
    if (!this.inited) {
      this.inited = true
    }
    this.pageNo++
    this.totalNum = data.totalNum || 0
    let list: Msg[] = data.list || []
    if (!list.length) return

    // this.chatId = list[0].id
    // setTimeout(() => {
    //   // https://github.com/rigor789/vue-scrollto#programmatically
    //   console.log('scrollTo start', '#chat-' + this.chatId)
    //   this.$scrollTo('#chat-' + this.chatId, 1000, {
    //     container: '#chat-container',
    //     easing: 'ease-in',
    //     // lazy: false,
    //     offset: -60,
    //     force: true,
    //     cancelable: true,
    //     x: false,
    //     y: true,
    //     onStart: function(element) {
    //       // scrolling started
    //       console.log('scrolling started', element)
    //     },
    //     onDone: function(element) {
    //       // scrolling is done
    //       console.log('scrolling onDone', element)
    //     },
    //     onCancel: function() {
    //       // scrolling has been interrupted
    //       console.log('scrolling onCancel')
    //     },
    //   })
    //   console.log('scrollTo end', '#chat-' + this.chatId)
    // }, 1000)

    list.reverse()
    // 处理消息
    list = this.handleMsg(list)
    // 拼接消息
    this.list = list.concat(this.list)
  }

  handleMsg (list: Msg[]): Msg[] {
    list.forEach(item => {
      if (item.type === 'link') {
        if (item.msgCn) {
          const matchUrl = item.msgCn.match(urlRegExp)
          if (matchUrl) {
            const url = matchUrl[0]
            const startIndex = matchUrl['index'] || 0
            const endIndex = startIndex + url.length
            const start = item.msgCn.substring(0, startIndex)
            const end = item.msgCn.substring(endIndex)
            item.linkMsg = `${start}<a href="${url}" target="_blank">${url}</a>${end}`
          }
        }
      }
    })
    return list
  }

  resetCondition (): void {
    this.inited = false
    this.pageNo = 1
    this.totalNum = 0
    this.list = []
  }

  formatTime (time: number): string {
    return dayjs(time).format('YYYY-MM-DD HH:mm')
  }
}
</script>

<style scoped>
.chat-record {
  overflow-y: auto;
}
.msg-item {
  display: flex;
  align-items: center;
}
/* .msg-receive {
  
} */
.msg-send {
  justify-content: flex-end;
}
.msg-content {
  min-width: 50px;
  max-width: 544px;
  padding: 6px 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
  line-height: 24px;
  vertical-align: top;
  word-break: break-all;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f2f5fa;
}
.msg-receive .msg-content {
  border-top-left-radius: 0;
}
.msg-send .msg-content {
  border-top-right-radius: 0;
}
.msg-msg {
  max-width: 200px;
}
</style>
