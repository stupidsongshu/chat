<template>
  <div>
    <ul class="contact-list" v-infinite-scroll="doGetContactList" :infinite-scroll-disabled="disabled">
      <li class="contact-item" :class="{selected: user.dscUserId === item.dscUserId}" v-for="item in list" :key="item.dscUserId" @click="updateUser(item)">
        <el-avatar shape="square" :size="60" :src="item.circleUrl"></el-avatar>
        <div class="contact-item-right">
          <div class="contact-item-row">
            <div class="user-name">{{item.remark || item.dscUserName}}</div>
            <div class="last-time">{{formatTime(item.lastTime)}}</div>
          </div>
          <div class="contact-item-row" v-if="item.tag">
            <el-tag size="mini">{{item.tag}}</el-tag>
          </div>
          <div class="contact-item-row">
            <div class="last-msg">{{item.lastMsg}}</div>
            <span class="new-msg-count" v-if="item.newMsgCount > 0">{{item.newMsgCount}}</span>
          </div>
        </div>
      </li>
    </ul>
    <p class="load-text" v-if="loading">加载中...</p>
    <!-- <p class="load-text" v-if="noMore">没有更多了</p> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { getContactList, getNewMsgList } from '@/utils/api'
import { ContactUser, Msg } from '@/types'

let inited = false
let newMsgTimer = 0
const newMsgInterval = 5000

@Component
export default class ContactList extends Vue{
  loading = false
  pageNo = 1
  pageSize = 20
  totalNum = 0
  list: ContactUser[] = []

  @Prop() readonly user!: ContactUser

  get noMore (): boolean {
    return this.list.length >= this.totalNum
  }
  get disabled (): boolean {
    return this.loading || this.noMore
  }

  // mounted (): void {
  //   this.doGetContactList()
  // }

  beforeDestroy (): void {
    if (newMsgTimer) {
      clearInterval(newMsgTimer)
    }
  }

  async doGetContactList (): Promise<void> {
    if (inited && this.noMore) return
    this.loading = true
    const [err, res] = await getContactList(this.pageNo, this.pageSize)
    this.loading = false
    if (err) return
    const { data } = res
    if (!data) return
    this.totalNum = data.totalNum || 0
    this.pageNo++
    const list = data.list || []
    list.forEach((item: ContactUser) => item.newMsgCount = 0)
    this.list = this.list.concat(list)

    // 每次初始，左侧用户拉取第一页最新用户信息
    if (!inited && this.list.length) {
      inited = true
      this.updateUser(this.list[0])
      // 定时拉取最新消息
      newMsgTimer = setInterval(this.doGetNewMsgList, newMsgInterval)
    }

    // 更新用户最新信息（如修改用户备注等操作）
    const user = this.list.find((item: ContactUser) => item.dscUserId === this.user.dscUserId)
    if (user) {
      this.updateUser(user)
    }
  }

  async doGetNewMsgList (): Promise<void> {
    const [err, res] = await getNewMsgList()
    if (err) return
    const { data } = res
    if (!data) return
    console.log(data)
    // 更新联系人列表提醒
    this.list.forEach(user => user.newMsgCount = 0)
    data.forEach((item: Msg) => {
      if (item.direction === 1) {
        const contactUser = this.list.find((user) => user.dscUserId === item.dscUserId)
        if (contactUser) {
          contactUser.newMsgCount += 1
        }
      }
    })

    // 更新正在聊天人的内容
  }

  formatTime (time: number): string {
    // return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    return time ? dayjs(time).format('HH:mm') : ''
  }

  // 更新选中聊天用户信息
  updateUser (user: ContactUser): void {
    this.$emit('update:user', user)
  }
}
</script>

<style scoped>
.contact-list {
  height: 100vh;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  padding: 15px;
  cursor: pointer;
}
.contact-item + .contact-item {
  border-top: 1px solid #ddd;
}
.contact-item:hover {
  background-color: #f2f5fa;
}
.contact-item.selected {
  background-color: #f2f5fa;
}

.contact-item-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
}
.contact-item-row {
  display: flex;
  justify-content: space-between;
}
.user-name {
  font-size: 14px;
  color: #333;
}
.last-time, .last-msg {
  font-size: 12px;
  color: #999;
}
.new-msg-count {
  padding: 0 6px;
  border-radius: 5px;
  font-size: 12px;
  color: #fff;
  background-color: #f00;
}

.load-text {
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
