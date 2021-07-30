<template>
  <div class="chat-wrapper">
    <ul id="chat-container" class="chat-content">
      <li v-if="inited && !noMore" class="msg-item" style="justify-content:center;">
        <!-- <el-button type="text" plain loading></el-button> -->
        <i class="el-icon-loading"></i>
      </li>
      <li
          v-for="item in list"
          :key="item.id"
          class="msg-item"
          :class="{'msg-send': item.direction === 0, 'msg-receive': item.direction === 1}"
          :id="'chat-' + item.id">
        <!-- direction: 0-我方发送 1-粉丝发送 -->
        <el-avatar class="user-avatar" shape="square" v-if="item.direction === 1" :size="36" :src="user.img || avatarDefaultUrl"></el-avatar>
        <!-- <div class="msg-content">{{formatTime(item.sendTime)}} {{item.msgCn}}</div> -->
        <!-- 纯文本 -->
        <div v-if="item.type === 'text'" class="msg-content">
          {{item.msgCn || item.msg}}
        </div>
        <!-- 含链接 -->
        <div v-else-if="item.type === 'link'" class="msg-content" v-html="item.linkMsg"></div>
        <!-- 图片 -->
        <div v-else-if="item.type === 'media'">
          <el-image class="msg-img" :src="item.url" :preview-src-list="[item.url]" @load="handleImgLoad"></el-image>
        </div>
      </li>
      <li id="chat-bottom"></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import dayjs from 'dayjs'
import BScroll, { BScrollInstance } from 'better-scroll'
import { ContactUser, Msg } from '@/types'
import { getMsgList } from '@/utils/api'
import { urlRegExp, decodeUnicode } from '@/utils'

let bs: BScrollInstance

@Component
export default class ContactUserMain extends Vue {
  inited = false
  loading = false
  pageNo = 1
  totalNum = 0
  list: Msg[] = []
  avatarDefaultUrl = require('@/assets/img/avatar.jpg')

  @Prop() user!: ContactUser

  get noMore (): boolean {
    return this.inited && (this.list.length >= this.totalNum)
  }

  @Watch('user.id', { immediate: false, deep: false })
  onUserIdChange(id: number): void {
    this.resetCondition()

    // 1. 优先从缓存中取聊天记录
    const userChatMap = this.$store.state.userChatMap
    const list: Msg[] = userChatMap[id]
    if (list && list.length) {
      this.list = list
      if (bs) {
        this.$nextTick(() => {
          bs.refresh()
          this.scrollToElement('#chat-bottom')
        })
      }
    }

    // 2. 再从接口获取最新数据
    this.doGetMsgList()
  }

  mounted (): void {
    bs = new BScroll('.chat-wrapper', {
      // wheel: true,
      // scrollY: true,
      // pullDownRefresh: true,
      // pullUpLoad: true,
      // scrollbar: true,
      // click: true,
      // probeType: 3,
      // useTransition: false,
      bounce: false,
      // scrollbar: {
      //   fade: false,
      //   interactive: true
      // },
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300,
        discreteTime: 400,
        throttleTime: 0,
        dampingFactor: 0.1
      },
      // mouseWheel: true,
      // bindToWrapper: true,
      // disableTouch: true,
      // disableMouse: true,
    })
    // bs.on('scrollStart', () => {
    //   console.log('scrollStart-')
    // })
    // bs.on('scroll', ({ y }) => {
    //   console.log('scrolling-', y)
    // })
    bs.on('scrollEnd', (pos: { x: number, y: number }) => {
      // console.log('scrollEnd:', pos)
      // 滚动到顶部 加载下一页
      if (pos.y === 0) {
        // console.log('滚动到顶部')
        if (this.pageNo > 1) {
          // console.log('滚动到顶部 加载下一页', this.pageNo)
          this.doGetMsgList()
        }
      }
    })
  }

  // beforeDestroy (): void {
  //   // console.log('beforeDestroy', bs.destroy)
  //   bs.destroy()
  // }

  handleImgLoad (): void {
    bs.refresh()
    if (this.pageNo === 2) {
      this.scrollToElement('#chat-bottom')
    }
  }

  scrollToElement (el: string | HTMLElement): void {
    bs.scrollToElement(el, 300, true, true)
  }

  updateNewMsg (msg: Msg): void {
    // 去重：防止多次插入同一条消息
    if (this.list.find(item => item.id === msg.id)) return
    // 处理消息
    const list = this.handleMsg([msg])
    // 拼接消息
    this.list = this.list.concat(list)
    // 缓存消息
    this.saveChatList(this.list)
    this.$nextTick(() => {
      bs.refresh()
      this.scrollToElement('#chat-bottom')
    })
  }

  async doGetMsgList (): Promise<void> {
    if (this.noMore) return
    this.loading = true
    const [err, res] = await getMsgList(this.user.userId, this.user.dscUserId, this.pageNo)
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
    list.reverse()
    // 去重
    list = this.uniqueMsgList(list, this.list)
    // 处理消息
    list = this.handleMsg(list)
    // 拼接消息
    const oldList = this.list
    this.list = list.concat(this.list)
    // 缓存消息
    this.saveChatList(this.list)

    this.$nextTick(() => {
      bs.refresh()
      // this.pageNo 始终 >= 2
      if (this.pageNo === 2) { // 第一次加载后滚动到底部
        this.scrollToElement('#chat-bottom')
      } else { // 第二次及以后加载后滚动到指定位置
        const id = oldList[0].id
        this.scrollToElement('#chat-' + id)
      }
    })
  }

  handleMsg (list: Msg[]): Msg[] {
    list.forEach(item => {
      if (item.msgCn) {
        item.msgCn = decodeUnicode(item.msgCn)
      }
      if (item.msg) {
        item.msg = decodeUnicode(item.msg)
      }

      if (item.type === 'link') {
        const msg = item.msgCn || item.msg
        if (msg) {
          const matchUrl = msg.match(urlRegExp)
          if (matchUrl) {
            const url = matchUrl[0]
            const startIndex = matchUrl['index'] || 0
            const endIndex = startIndex + url.length
            const start = msg.substring(0, startIndex)
            const end = msg.substring(endIndex)
            item.linkMsg = `${start}<a href="${url}" target="_blank" style="text-decoration: none;color: #409EFF;">${url}</a>${end}`
          } else {
            item.linkMsg = msg
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

  uniqueMsgList (newList: Msg[], oldList: Msg[]): Msg[] {
    if (!oldList.length) {
      return newList
    }
    const list: Msg[] = []
    newList.forEach(item => {
      if (!oldList.find(oldItem => oldItem.id === item.id)) {
        list.push(item)
      }
    })
    return list
  }

  saveChatList (list: Msg[]): void {
    this.$store.commit('SET_USER_CHAT_MAP', { id: this.user.id, list })
  }
}
</script>

<style scoped>
.chat-wrapper {
  height: 100%;
  overflow: hidden;
}
.chat-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100%;
}
.msg-item {
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
}
.msg-send {
  justify-content: flex-end;
}
.msg-content {
  min-width: 50px;
  max-width: 544px;
  padding: 6px 10px;
  line-height: 24px;
  vertical-align: top;
  word-break: break-all;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f2f5fa;
}
.msg-receive .user-avatar {
  margin-right: 10px;
}
.msg-receive .msg-content {
  border-top-left-radius: 0;
}
.msg-send .msg-content {
  border-top-right-radius: 0;
}
.msg-img {
  max-width: 200px;
  border-radius: 10px;
  border: 1px solid #eee;
}
</style>
