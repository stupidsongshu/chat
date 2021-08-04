<template>
  <div class="chat-edit">
    <ul class="chat-tools">
      <li class="chat-tool">
        <el-popover
          ref="emoji-popover"
          width="300"
          placement="top"
          trigger="click">
          <!-- <ul class="emoji-list">
            <li class="emoji-item" v-for="(item, index) in expressionList" :key="index" @click="insertMsg(item)">
              <span class="emoji">{{item}}</span>
            </li>
            <li class="emoji-item">
              <span class="emoji">😔</span>
            </li>
          </ul> -->
          <div class="emoji-list">
            <span class="emoji-item" v-for="(item, index) in expressionList" :key="index" @click="insertMsg(item)">
              {{item}}
            </span>
          </div>
          <div class="custom-item">
            <el-input v-model="expression" clearable placeholder="请输入表情" style="width:150px;margin-right:10px;"></el-input>
            <el-link type="primary" :underline="false" @click="doSaveExpression"><i class="el-icon-plus"></i>添加</el-link>
          </div>
          <el-link slot="reference" style="font-size: 20px; font-weight: bold" :underline="false" @click="doGetExpression">
            <!-- <i class="el-icon-user"></i> -->
            <!-- <span style="font-size:20px;">😊</span> -->
            <i class="iconfont icon-Smile"></i>
          </el-link>
        </el-popover>
      </li>
      <li class="chat-tool">
        <el-popover
          ref="msg-commonly-popover"
          width="300"
          placement="top"
          trigger="click">
          <el-link class="msg-commonly" :underline="false" v-for="item in msgCommonlyList" :key="item.id" @click="insertMsg(item.msg)">{{item.msg}}</el-link>
          <div class="custom-item">
            <el-input v-model="msgCommonly" clearable placeholder="请输入常用回复" style="width:150px;margin-right:10px;"></el-input>
            <el-link type="primary" :underline="false" @click="doSaveMsgCommonly"><i class="el-icon-plus"></i>添加</el-link>
          </div>
          <el-link slot="reference" style="font-size: 20px;" :underline="false" @click="doGetMsgCommonlyList">
          <i class="el-icon-chat-line-square"></i>
        </el-link>
        </el-popover>
      </li>
    </ul>

    <textarea
      class="chat-input"
      ref="textareaRef"
      v-model="msg"
      @dragover="dragover"
      @drop="drop"
      placeholder="请输入内容或拖拽图片">
    </textarea>

    <div class="chat-send">
      <el-button
        type="primary"
        size="mini"
        round
        :loading="loading"
        @click="send('text', msg)">
        发送
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { ContactUser, Msg, MsgType } from '@/types'
import { uploadImg, getExpression, saveExpression, getMsgCommonlyList, saveMsgCommonly } from '@/utils/api'
import { urlRegExp } from '@/utils'

@Component
export default class ChatEdit extends Vue {
  loading = false
  msg = '' // 发送内容
  expression = '' // 自定义表情
  expressionList = [] // 表情列表
  // expressionList = ['😔', '😁', '😉', '😱', '😖', '😚', '😝', '😌', '😨', '😷', '😳', '😒', '😰', '😲', '😭', '😜', '😘', '😡', '💪', '👊', '👍', '☝', '👏', '✌', '👎', '🙏', '👌', '👈', '👉', '👆', '👇', '👀', '👃', '👄', '👂', '🍚', '🍝', '🍜', '🍙', '🍧', '🍣', '🎂', '🍞', '🍔', '🍳', '🍟', '🍺', '🍻', '🍸', '☕', '🍎', '🍊', '🍓', '🍉', '💊', '🚬', '🎄', '🌹', '🎉', '🌴', '💝', '🎀', '🎈', '🐚', '💍', '💣', '👑', '🔔', '⭐', '✨', '💨', '💦', '🔥', '🏆', '💰', '💤', '⚡', '👣', '💩', '💉', '♨', '📫', '🔑', '🔒', '✈', '🚄', '🚗', '🚤', '🚲', '🐎', '🚀', '🚌', '⛵', '👩', '👨', '👧', '👦', '🐵', '🐙', '🐷', '🐤', '🐨', '🐮', '🐔', '🐸', '👻', '💀', '🐛', '🐠', '🐶', '🐯', '👼', '🐧', '🐳', '🐭', '👒', '👗', '💄', '👠', '👢', '🌂', '👜', '👙', '👕', '👟', '☁', '☀', '☔', '🌙', '⛄', '⭕', '❌', '❔', '❕', '☎', '📷', '📱', '📠', '💻', '🎥', '🎤', '🔫', '💿', '💓', '♣', '🀄', '〽', '🎰', '🚥', '🚧', '🎸', '💈', '🛀', '🚽', '🏠', '⛪', '🏦', '🏥', '🏨', '🏧', '🏪', '🚹', '🚺']
  msgCommonlyList = [] // 常用回复
  msgCommonly = ''

  @Prop() readonly user!: ContactUser

  @Ref() readonly textareaRef!: HTMLTextAreaElement

  get disabled (): boolean {
    return !(this.user.dscUserId && this.msg.trim())
  }
  get disableSendMsg (): boolean {
    return this.user.isBan === 1 || !this.user.dscUserName
  }

  // https://stackoverflow.com/questions/34982381/how-to-insert-at-caret-position-of-contenteditable-using-typescript
  insertMsg (data: string): void {
    const selectionStart = this.textareaRef.selectionStart
    const selectionEnd = this.textareaRef.selectionEnd
    // if (document.selection) {
    //   document.selection.createRange().text = data
    // } else if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
    //   this.msg = [this.msg.substring(0, selectionStart), data, this.msg.substring(selectionEnd)].join('')
    // } else {
    //   this.msg += data
    // }
    if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
      this.msg = [this.msg.substring(0, selectionStart), data, this.msg.substring(selectionEnd)].join('')
    } else {
      this.msg += data
    }
  }

  dragover (e: DragEvent): void {
    e.preventDefault()
  }
  drop (e: DragEvent): void {
    e.preventDefault()
    const files = e.dataTransfer?.files || []
    const file = files[0]
    if (!file) return
    // 校验文件格式
    const whiteList = [
      'image/jpeg',
      'image/jeg',
      'image/png',
      'image/gif',
    ]
    if (whiteList.indexOf(file.type) === -1) {
      this.$message({
        message: '请上传图片',
        type: 'warning'
      })
    }
    this.sendImage(file)
  }

  async send (type: MsgType, data: string): Promise<void> {
    if (this.disableSendMsg) {
      if (this.user.isBan === 1) {
        this.$message({
          message: '账号已封禁',
          type: 'error'
        })
      }
      if (!this.user.dscUserName) {
        this.$message({
          message: '没有userName',
          type: 'error'
        })
      }
      return
    }
    let msgCn = ''
    let url = ''
    if (!this.user.dscUserId) {
      this.$message({
        message: '请选择用户',
        type: 'warning'
      })
      return
    }

    if (type === 'text') {
      if (!data.trim()) {
        this.$message({
          message: '请输入内容',
          type: 'warning'
        })
        return
      }
      const matchUrl = data.match(urlRegExp)
      // console.log('type=link matchUrl:', matchUrl)
      if (matchUrl && matchUrl.length) { // URL
        type = 'link'
        url = matchUrl[0]
      }
      msgCn = data
    } else if (type === 'media') {
      if (!data.trim()) {
        this.$message({
          message: '请上传图片',
          type: 'warning'
        })
        return
      }
      url = data
    } else {
      this.$message({
        message: '消息类型不正确',
        type: 'error'
      })
      return
    }

    // this.loading = true
    // await sendMsg(this.user.userId, this.user.dscUserId, type, msgCn, url)
    // this.loading = false

    const msg: Msg = {
      userId: this.user.userId,
      dscUserId: this.user.dscUserId,
      action: 'sendMsg', // 类型：sendMsg-发送消息
      direction: 0, // 0-我方发送 1-粉丝发送
      status: 0,
      type,
      msgCn,
      url
    }
    this.$emit('sendMsg', msg)

    if (type !== 'media') {
      this.msg = ''
    }
  }

  // 发送图片
  async sendImage (file: File): Promise<void> {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    this.loading = true
    const [err, res] = await uploadImg(formData)
    this.loading = false
    if (err) return
    const { data } = res
    if (!data) return
    this.send('media', data)
  }

  // 表情
  async doGetExpression (): Promise<void> {
    const [err, res] = await getExpression()
    if (err) return
    const { data } = res
    if (!data) return
    this.expressionList = JSON.parse(data) || []
    // fix element-ui的 popover 组件位置偏移
    this.$nextTick(() => {
      (this.$refs['emoji-popover'] as any).updatePopper()
    })
  }

  async doSaveExpression (): Promise<void> {
    const expression = this.expression.trim()
    if (!expression) {
      this.$message({
        message: '请输入表情',
        type: 'warning'
      })
      return
    }
    const [err, res] = await saveExpression(JSON.stringify([...this.expressionList, expression]))
    if (err) return
    if (!res) return
    this.expression = ''
    this.doGetExpression()
  }

  // 常用回复
  async doGetMsgCommonlyList (): Promise<void> {
    const [err, res] = await getMsgCommonlyList()
    if (err) return
    const { data } = res
    if (!data) return
    this.msgCommonlyList = data
    this.$nextTick(() => {
      (this.$refs['msg-commonly-popover'] as any).updatePopper()
    })
  }

  async doSaveMsgCommonly (): Promise<void> {
    const msgCommonly = this.msgCommonly.trim()
    if (!msgCommonly) {
      this.$message({
        message: '请输入常用回复',
        type: 'warning'
      })
      return
    }
    const [err, res] = await saveMsgCommonly(msgCommonly)
    if (err) return
    if (!res) return
    this.msgCommonly = ''
    this.doGetMsgCommonlyList()
  }
}
</script>

<style scoped>
/* .emoji-list {

} */
.emoji-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.emoji-item:hover {
  background-color: #f2f2f2;
}
.emoji {
  /* display: inline-block;
  width: 25px;
  height: 25px; */
  font-size: 25px;
}

.chat-edit {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px 0;
}

.chat-tools {
  display: flex;
}
.chat-tool {
  display: flex;
  align-items: center;
}
.chat-tool + .chat-tool {
  margin-left: 15px;
}
.custom-item {
  margin-top: 5px;
}
.msg-commonly {
  display: block;
  padding: 5px 0;
}
.msg-commonly:hover {
  background-color: #f2f2f2;
}

.chat-input {
  display: flex;
  flex: 1;
  margin: 10px 0;
  border: none;
  outline: none;
  resize: none;
}

.chat-send {
  text-align: right;
}
</style>
