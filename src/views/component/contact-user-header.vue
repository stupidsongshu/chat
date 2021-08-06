<template>
  <el-row class="contact-user-header" type="flex" justify="between">
    <el-col :span="10">
      <div>{{this.user.dscUserName}}</div>
      <div>{{this.user.remark}}</div>
    </el-col>
    <el-col :span="10">
      {{firstName}}
    </el-col>
    <el-col :span="4" class="remark">
      <el-popover
        trigger="hover"
        placement="bottom"
        width="300"
        v-model="isEdit">
        <el-input ref="remarkRef" v-model="remark" autofocus clearable placeholder="请输入备注" style="margin-right:10px;"></el-input>
        <div style="margin-top: 10px; text-align: right;">
          <el-button size="mini" type="text" @click="isEdit = false">取消</el-button>
          <el-button size="mini" type="primary" @click="doSaveRemark">确定</el-button>
        </div>
        <el-link slot="reference" type="primary" :underline="false" @click="isEdit = true"><i class="el-icon-edit"></i>修改</el-link>
      </el-popover>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ContactUser } from '@/types'
import { getAccount, saveRemark } from '@/utils/api'
import ws from '@/utils/ws'

@Component
export default class ContactUserHeader extends Vue {
  isEdit = false
  remark = ''
  firstName = ''

  @Prop() readonly socket?: WebSocket
  @Prop() user!: ContactUser

  @Watch('user.id')
  onUserIdChange (): void {
    // this.doGetAccount()
    this.ws_send_getAccount()
  }

  // async doGetAccount(): Promise<void> {
  //   const [err, res] = await getAccount(this.user.userId, this.user.dscUserId)
  //   if (err) return
  //   if (!res) return
  //   const { data } = res
  //   if (!data) return
  //   this.firstName = data.firstName
  // }

  ws_send_getAccount (): void {
    this.socket?.send(JSON.stringify({ action: ws.account.send, userId: this.user.userId, dscUserId: this.user.dscUserId }))
  }

  ws_receive_getAccount (data: any): void {
    if (!data) return
    this.firstName = data.firstName
  }

  async doSaveRemark(): Promise<void> {
    const remark = this.remark.trim()
    if (!remark) {
      this.$message({
        message: '请输入备注',
        type: 'warning'
      })
      return
    }
    const [err, res] = await saveRemark(this.user.userId, this.user.dscUserId, remark)
    if (err || !res) return
    this.$message({
      message: res.data,
      type: 'success'
    })
    this.isEdit = false
    this.remark = ''
    this.$store.commit('SET_CONTACT_USER', {
      ...this.user,
      remark
    })
  }
}
</script>

<style scoped>
.contact-user-header {
  height: 100%;
  align-items: center;
}
.remark {
  display: flex;
  justify-content: flex-end
}
</style>
