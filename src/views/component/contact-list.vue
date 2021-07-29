<template>
  <div>
    <ul class="contact-list" v-infinite-scroll="doGetContactList" :infinite-scroll-disabled="disabled">
      <li class="contact-item" :class="{selected: user.id === item.id}" v-for="item in list" :key="item.id" @click="updateUser(item)">
        <el-avatar shape="square" :size="60" :src="item.img || avatarDefaultUrl"></el-avatar>
        <div class="contact-item-right">
          <div class="contact-item-row">
            <div class="user-name">
              <span>{{item.remark || item.dscUserName || '未知'}}</span>
              <span class="new-msg-count" v-if="item.isBan === 1">封禁</span>
            </div>
            <div class="last-time">{{formatTime(item.lastTime)}}</div>
          </div>
          <div class="contact-item-row" v-if="item.tag">
            <el-tag size="mini">{{item.tag}}</el-tag>
          </div>
          <div class="contact-item-row">
            <div class="last-msg">{{item.lastMsg}}</div>
            <span class="new-msg-count" v-if="item.msgCou > 0">{{item.msgCou}}</span>
          </div>
        </div>
      </li>
      <li class="loading-text" v-if="loading">
        <el-button type="text" plain size="mini">
          <i class="el-icon-loading"></i> 加载中...
        </el-button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { getContactList, getMsgList } from '@/utils/api'
import { ContactUser } from '@/types'

let inited = false

@Component
export default class ContactList extends Vue{
  loading = false
  pageNo = 1
  totalNum = 0
  avatarDefaultUrl = require('@/assets/img/avatar.jpg')

  @Prop() readonly user!: ContactUser

  get list(): ContactUser[] {
    return this.$store.state.contactList
  }

  get noMore (): boolean {
    return this.list.length >= this.totalNum
  }
  get disabled (): boolean {
    return this.loading || this.noMore
  }

  formatTime (time: number): string {
    // return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    return time ? dayjs(time).format('HH:mm') : ''
  }

  updateUser (user: ContactUser): void {
    const contactUser = this.list.find(item => item.id === user.id)
    if (!contactUser) return
    // 更新消息提醒
    if (contactUser.msgCou > 0) {
      contactUser.msgCou = 0
      this.$store.commit('SET_CONTACT_LIST', this.list)
      // 正在聊天的联系人，主动调用 getMsgList 通知服务端消息已读
      if (this.user.id === user.id) {
        getMsgList(user.userId, user.dscUserId, 1)
      }
    }
    // 更新选中聊天用户信息
    this.$store.commit('SET_CONTACT_USER', contactUser)
  }

  async doGetContactList (): Promise<void> {
    if (inited && this.noMore) return
    this.loading = true
    const [err, res] = await getContactList(this.pageNo)
    this.loading = false
    if (err) return
    const { data } = res
    if (!data) return
    this.pageNo++
    this.totalNum = data.totalNum || 0
    const list = data.list || []
    this.$store.commit('SET_CONTACT_LIST', this.list.concat(list))
    if (!inited) {
      inited = true
      if (list.length) {
        // 每次初始化后拉取与第一个最新联系人的聊天记录
        this.$store.commit('SET_CONTACT_USER', list[0])
      }
      // 开始连接 WebSocket
      this.$emit('openSocket')
    }
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
.contact-item {
  border-bottom: 1px solid #ddd;
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
  margin-left: 5px;
  border-radius: 5px;
  font-size: 12px;
  color: #fff;
  background-color: #f00;
}

.loading-text {
  padding: 5px 0;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
